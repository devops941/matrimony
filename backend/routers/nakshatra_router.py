from fastapi import APIRouter, HTTPException
from db import db
from schemas.nakshatra_schema import NakshatraCreate, NakshatraUpdate, NakshatraOut
from typing import List

router = APIRouter(prefix="/api/nakshatras", tags=["nakshatras"])

@router.get("", response_model=List[NakshatraOut])
async def get_nakshatras():
    """Retrieve all custom Nakshatras from MongoDB."""
    records = await db.nakshatra.find_many()
    return records

@router.post("", response_model=NakshatraOut, status_code=201)
async def create_nakshatra(data: NakshatraCreate):
    """Create a new custom Nakshatra in MongoDB."""
    existing = await db.nakshatra.find_unique(where={"name": data.name.strip()})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Nakshatra with name '{data.name}' already exists."
        )
    
    payload = data.model_dump()
    payload["name"] = payload["name"].strip()
    payload["isActive"] = True
    
    record = await db.nakshatra.create(data=payload)
    return record

@router.put("/{id}", response_model=NakshatraOut)
async def update_nakshatra(id: str, data: NakshatraUpdate):
    """Update custom Nakshatra name or status by id."""
    existing = await db.nakshatra.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Nakshatra not found")
        
    payload = data.model_dump(exclude_unset=True)
    if "name" in payload:
        payload["name"] = payload["name"].strip()
        # Verify unique name if name changed
        if payload["name"] != existing.name:
            dup = await db.nakshatra.find_unique(where={"name": payload["name"]})
            if dup:
                raise HTTPException(status_code=400, detail=f"Nakshatra '{payload['name']}' already exists.")
                
    record = await db.nakshatra.update(where={"id": id}, data=payload)
    return record

@router.delete("/{id}")
async def delete_nakshatra(id: str):
    """Delete custom Nakshatra by id."""
    existing = await db.nakshatra.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Nakshatra not found")
        
    await db.nakshatra.delete(where={"id": id})
    return {"message": "Nakshatra deleted successfully", "id": id}