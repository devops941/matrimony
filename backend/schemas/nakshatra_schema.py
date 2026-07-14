from pydantic import BaseModel, Field
from typing import Optional


class NakshatraCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)


class NakshatraUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    isActive: Optional[bool] = None


class NakshatraOut(BaseModel):
    id: str
    name: str
    isActive: bool
