from fastapi import APIRouter, HTTPException
from db import db
from schemas.porutham_schema import PoruthamOut, PoruthamUpdate
from typing import List

router = APIRouter(prefix="/api/poruthams", tags=["poruthams"])

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
    return record