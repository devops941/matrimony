from fastapi import APIRouter, HTTPException
from db import db
from prisma_client import Json
from typing import List
from pydantic import BaseModel
from data.nakshatra_default import DEFAULT_REAL_MATRIX

router = APIRouter(prefix="/api/nakshatra-matrix", tags=["nakshatra-matrix"])

class MatrixUpdatePayload(BaseModel):
    matrix: List[List[int]]

@router.get("")
async def get_matrix():
    """Fetch the current Nakshatra Porutham matrix. Automatically initializes database if empty."""
    record = await db.nakshatramatrix.find_first()
    if not record:
        # Initialize database with default matrix
        record = await db.nakshatramatrix.create(
            data={
                "matrix": Json(DEFAULT_REAL_MATRIX),
                "isCustomized": False
            }
        )
    return {"matrix": record.matrix, "isCustomized": record.isCustomized}

@router.put("")
async def update_matrix(payload: MatrixUpdatePayload):
    """Update the Nakshatra Porutham matrix in the database."""
    # Simple validation of dimensions
    matrix = payload.matrix
    if len(matrix) != 36 or any(len(row) != 36 for row in matrix):
        raise HTTPException(
            status_code=400,
            detail="Invalid matrix dimensions. Must be a 36x36 grid of numbers."
        )

    record = await db.nakshatramatrix.find_first()
    if not record:
        # Create new record
        record = await db.nakshatramatrix.create(
            data={
                "matrix": Json(matrix),
                "isCustomized": True
            }
        )
    else:
        # Update existing record
        record = await db.nakshatramatrix.update(
            where={"id": record.id},
            data={
                "matrix": Json(matrix),
                "isCustomized": True
            }
        )
    return {"matrix": record.matrix, "isCustomized": record.isCustomized, "message": "Matrix updated successfully"}

@router.post("/reset")
async def reset_matrix():
    """Reset the Nakshatra Porutham matrix in the database back to standard default values."""
    record = await db.nakshatramatrix.find_first()
    if not record:
        record = await db.nakshatramatrix.create(
            data={
                "matrix": Json(DEFAULT_REAL_MATRIX),
                "isCustomized": False
            }
        )
    else:
        record = await db.nakshatramatrix.update(
            where={"id": record.id},
            data={
                "matrix": Json(DEFAULT_REAL_MATRIX),
                "isCustomized": False
            }
        )
    return {"matrix": record.matrix, "isCustomized": record.isCustomized, "message": "Matrix reset to default standard values"}