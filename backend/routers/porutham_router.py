from fastapi import APIRouter, HTTPException
from db import db
from schemas.porutham_schema import PoruthamOut, PoruthamUpdate
from typing import List
from porutham_engine import calculate_porutham

router = APIRouter(prefix="/api/poruthams", tags=["poruthams"])

@router.get("/match-candidates")
async def get_match_candidates(profile_id: str):
    candidate = await db.profile.find_unique(where={"id": profile_id})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    opposite_gender = "Female" if candidate.gender == "Male" else "Male"
    candidates = await db.profile.find_many(
        where={
            "gender": opposite_gender,
            "approvedByAdmin": True
        }
    )

    matches = []
    from routers.profile_router import format_profile_response
    for c in candidates:
        if candidate.gender == "Male":
            bride_star = c.nakshatra
            groom_star = candidate.nakshatra
        else:
            bride_star = candidate.nakshatra
            groom_star = c.nakshatra

        result = await calculate_porutham(bride_star_name=bride_star, groom_star_name=groom_star)
        matches.append({
            "profile": format_profile_response(c),
            "matchResult": result
        })

    # Sort matches by percentage match descending
    matches.sort(key=lambda x: x["matchResult"]["percentage"], reverse=True)
    return matches

from match_queue import add_match_task, task_status

@router.post("/trigger-match")
async def trigger_match(profile_id: str):
    """Trigger background match calculation task via queue."""
    candidate = await db.profile.find_unique(where={"id": profile_id})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    await add_match_task(profile_id)
    return {"status": "queued", "profile_id": profile_id}

@router.get("/task-status/{profile_id}")
async def get_task_status(profile_id: str):
    """Get the current progress or completed results of the match queue task."""
    status_info = task_status.get(profile_id)
    if not status_info:
        return {"status": "not_started"}
    
    # Format profiles if results are completed
    if status_info.get("status") == "completed" and "results" in status_info:
        from routers.profile_router import format_profile_response
        formatted_results = []
        for r in status_info["results"]:
            formatted_results.append({
                "profile": format_profile_response(r["profile"]),
                "matchResult": r["matchResult"]
            })
        return {
            "status": status_info["status"],
            "progress": status_info["progress"],
            "results": formatted_results
        }
    return status_info

@router.get("/calculate")
async def calculate_two_stars(bride_star: str, groom_star: str):
    """Calculate the 10-Porutham matching scorecard for two stars dynamically."""
    return await calculate_porutham(bride_star_name=bride_star, groom_star_name=groom_star)

@router.get("", response_model=List[PoruthamOut])
async def get_poruthams():
    """Retrieve all 10 Poruthams ordered by orderIndex."""
    records = await db.porutham.find_many(order={"orderIndex": "asc"})
    return records

@router.put("/{id}", response_model=PoruthamOut)
async def update_porutham(id: str, data: PoruthamUpdate):
    """Toggle enabled/disabled status of a Porutham."""
    existing = await db.porutham.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Porutham not found")

    payload = data.model_dump(exclude_unset=True)
    record = await db.porutham.update(where={"id": id}, data=payload)
    from porutham_engine import clear_astro_cache
    clear_astro_cache()
    return record