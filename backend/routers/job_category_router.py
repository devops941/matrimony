from fastapi import APIRouter, HTTPException
from db import db
from schemas.job_category_schema import JobCategoryCreate, JobCategoryUpdate, JobCategoryOut
from typing import List

router = APIRouter(prefix="/api/job-categories", tags=["job-categories"])


@router.get("", response_model=List[JobCategoryOut])
async def get_job_categories():
    """Retrieve all job categories."""
    records = await db.jobcategory.find_many(order={"name": "asc"})
    return records


@router.post("", response_model=JobCategoryOut, status_code=201)
async def create_job_category(data: JobCategoryCreate):
    """Create a new job category."""
    existing = await db.jobcategory.find_unique(where={"name": data.name.strip()})
    if existing:
        raise HTTPException(status_code=400, detail=f"Job category '{data.name}' already exists.")

    record = await db.jobcategory.create(data={"name": data.name.strip(), "isActive": True})
    return record


@router.put("/{id}", response_model=JobCategoryOut)
async def update_job_category(id: str, data: JobCategoryUpdate):
    """Update job category name or status."""
    existing = await db.jobcategory.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Job category not found")

    payload = data.model_dump(exclude_unset=True)
    if "name" in payload:
        payload["name"] = payload["name"].strip()
        if payload["name"] != existing.name:
            dup = await db.jobcategory.find_unique(where={"name": payload["name"]})
            if dup:
                raise HTTPException(status_code=400, detail=f"Job category '{payload['name']}' already exists.")

    record = await db.jobcategory.update(where={"id": id}, data=payload)
    return record


@router.delete("/{id}")
async def delete_job_category(id: str):
    """Delete job category by id."""
    existing = await db.jobcategory.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Job category not found")

    await db.jobcategory.delete(where={"id": id})
    return {"message": "Job category deleted", "id": id}