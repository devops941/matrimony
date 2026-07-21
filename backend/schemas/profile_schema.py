from pydantic import BaseModel, EmailStr
from typing import List, Optional

class ProfileExpectationsSchema(BaseModel):
    minAge: int
    maxAge: int
    acceptedCommunities: List[str]
    acceptedJobTypes: List[str]
    minAnnualIncomeLakhs: int
    acceptedLocations: List[str]
    goldExpectedSovereigns: Optional[int] = 0
    houseOwnedRequired: Optional[bool] = False
    minHeight: Optional[str] = ""
    maxHeight: Optional[str] = ""
    preferredEducation: Optional[str] = ""

class ProfileCreateSchema(BaseModel):
    name: str
    gender: str
    age: int
    height: str
    weight: Optional[str] = ""
    location: str
    community: str
    nakshatra: str
    rasi: str
    education: str
    jobType: str
    annualIncomeLakhs: int
    bio: str
    avatarUrl: str
    chevvaiDosham: str
    birthDate: str
    birthTime: str
    birthPlace: str
    
    # New Personal Details
    bloodGroup: Optional[str] = ""
    diet: Optional[str] = "Vegetarian"
    maritalStatus: Optional[str] = "Never Married"
    motherTongue: Optional[str] = "Tamil"
    contactNumber: Optional[str] = ""
    email: Optional[EmailStr] = ""
    
    # New Family Details
    fatherName: Optional[str] = ""
    fatherOccupation: Optional[str] = ""
    motherName: Optional[str] = ""
    motherOccupation: Optional[str] = ""
    siblings: Optional[int] = 0
    
    expectations: ProfileExpectationsSchema
    approvedByAdmin: Optional[bool] = True
    confirmedMatchedWith: Optional[str] = None
    registrationId: Optional[str] = None
    password: Optional[str] = None

class ProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None

class ConfirmMatchRequest(BaseModel):
    profileId1: str
    profileId2: str
    age: Optional[int] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    location: Optional[str] = None
    community: Optional[str] = None
    nakshatra: Optional[str] = None
    rasi: Optional[str] = None
    education: Optional[str] = None
    jobType: Optional[str] = None
    annualIncomeLakhs: Optional[int] = None
    bio: Optional[str] = None
    avatarUrl: Optional[str] = None
    chevvaiDosham: Optional[str] = None
    birthDate: Optional[str] = None
    birthTime: Optional[str] = None
    birthPlace: Optional[str] = None
    
    # New Personal Details
    bloodGroup: Optional[str] = None
    diet: Optional[str] = None
    maritalStatus: Optional[str] = None
    motherTongue: Optional[str] = None
    contactNumber: Optional[str] = None
    email: Optional[EmailStr] = None
    
    # New Family Details
    fatherName: Optional[str] = None
    fatherOccupation: Optional[str] = None
    motherName: Optional[str] = None
    motherOccupation: Optional[str] = None
    siblings: Optional[int] = None
    
    expectations: Optional[ProfileExpectationsSchema] = None
    approvedByAdmin: Optional[bool] = None
    confirmedMatchedWith: Optional[str] = None
    registrationId: Optional[str] = None
    password: Optional[str] = None
