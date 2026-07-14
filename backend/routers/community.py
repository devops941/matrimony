from fastapi import APIRouter, HTTPException
from db import db
from schemas.community import CommunityCreate, CommunityUpdate, CommunityOut
from typing import List

router = APIRouter(prefix="/api/communities", tags=["communities"])

@router.get("", response_model=List[CommunityOut])
async def get_communities():
    """Retrieve all communities from MongoDB."""
    records = await db.community.find_many()
    return records

@router.post("", response_model=CommunityOut, status_code=201)
async def create_community(data: CommunityCreate):
    """Create a new community in MongoDB."""
    existing = await db.community.find_first(where={"name": data.name.strip()})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Community '{data.name}' already exists."
        )
    
    payload = data.model_dump()
    payload["name"] = payload["name"].strip()
    payload["isActive"] = True
    
    record = await db.community.create(data=payload)
    return record

@router.put("/{id}", response_model=CommunityOut)
async def update_community(id: str, data: CommunityUpdate):
    """Update community name or status by id."""
    existing = await db.community.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Community not found")
    
    payload = data.model_dump(exclude_unset=True)
    if "name" in payload:
        payload["name"] = payload["name"].strip()
        # Verify unique name if name changed
        if payload["name"] != existing.name:
            dup = await db.community.find_first(where={"name": payload["name"]})
            if dup:
                raise HTTPException(status_code=400, detail=f"Community '{payload['name']}' already exists.")
                
    record = await db.community.update(where={"id": id}, data=payload)
    return record

@router.delete("/{id}")
async def delete_community(id: str):
    """Delete community by id."""
    existing = await db.community.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Community not found")
        
    await db.community.delete(where={"id": id})
    return {"message": "Community deleted successfully", "id": id}