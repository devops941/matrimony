from pydantic import BaseModel, Field
from typing import Optional


class CommunityCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)


class CommunityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    isActive: Optional[bool] = None


class CommunityOut(BaseModel):
    id: str
    name: str
    isActive: bool
