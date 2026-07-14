from pydantic import BaseModel
from typing import Optional


class PoruthamOut(BaseModel):
    id: str
    key: str
    label: str
    description: str
    orderIndex: int
    isEnabled: bool


class PoruthamUpdate(BaseModel):
    isEnabled: Optional[bool] = None
