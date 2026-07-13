from pydantic import BaseModel, Field
from typing import Optional


class CompanyProfileCreate(BaseModel):
    companyName: str = Field(..., min_length=1, max_length=200)
    address: str = Field(..., min_length=1, max_length=500)
    phone: str = Field(..., min_length=1, max_length=20)
    email: str = Field(..., min_length=1, max_length=200)
    whatsappNumber: str = Field(..., min_length=1, max_length=20)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    country: str = Field(..., min_length=1, max_length=100)
    gstNumber: str = Field(default="", max_length=30)
    incorporationDetails: str = Field(default="", max_length=300)
    companyLogoUrl: Optional[str] = ""


class CompanyProfileUpdate(BaseModel):
    companyName: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    whatsappNumber: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    gstNumber: Optional[str] = None
    incorporationDetails: Optional[str] = None
    companyLogoUrl: Optional[str] = None


class CompanyProfileOut(BaseModel):
    id: str
    companyName: str
    address: str
    phone: str
    email: str
    whatsappNumber: str
    city: str
    state: str
    country: str
    gstNumber: str
    incorporationDetails: str
    companyLogoUrl: str
