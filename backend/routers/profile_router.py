from fastapi import APIRouter, HTTPException
from db import db
from schemas.profile_schema import ProfileCreateSchema, ProfileUpdateSchema
from typing import List
import uuid
import random
import string
import hashlib

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

def generate_password(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def format_profile_response(profile, plain_password=None):
    return {
        "id": profile.id,
        "registrationId": profile.registrationId,
        "password": plain_password if plain_password else profile.password,
        "name": profile.name,
        "gender": profile.gender,
        "age": profile.age,
        "height": profile.height,
        "weight": profile.weight if hasattr(profile, 'weight') else "",
        "location": profile.location,
        "community": profile.community,
        "nakshatra": profile.nakshatra,
        "rasi": profile.rasi,
        "education": profile.education,
        "jobType": profile.jobType,
        "annualIncomeLakhs": profile.annualIncomeLakhs,
        "bio": profile.bio,
        "avatarUrl": profile.avatarUrl,
        "chevvaiDosham": profile.chevvaiDosham,
        "birthDate": profile.birthDate,
        "birthTime": profile.birthTime,
        "birthPlace": profile.birthPlace,
        # New Personal Details
        "bloodGroup": profile.bloodGroup if hasattr(profile, 'bloodGroup') else "",
        "diet": profile.diet if hasattr(profile, 'diet') else "Vegetarian",
        "maritalStatus": profile.maritalStatus if hasattr(profile, 'maritalStatus') else "Never Married",
        "motherTongue": profile.motherTongue if hasattr(profile, 'motherTongue') else "Tamil",
        "contactNumber": profile.contactNumber if hasattr(profile, 'contactNumber') else "",
        "email": profile.email if hasattr(profile, 'email') else "",
        # New Family Details
        "fatherName": profile.fatherName if hasattr(profile, 'fatherName') else "",
        "fatherOccupation": profile.fatherOccupation if hasattr(profile, 'fatherOccupation') else "",
        "motherName": profile.motherName if hasattr(profile, 'motherName') else "",
        "motherOccupation": profile.motherOccupation if hasattr(profile, 'motherOccupation') else "",
        "siblings": profile.siblings if hasattr(profile, 'siblings') else 0,
        "approvedByAdmin": profile.approvedByAdmin,
        "confirmedMatchedWith": profile.confirmedMatchedWith,
        "expectations": {
            "minAge": profile.expMinAge,
            "maxAge": profile.expMaxAge,
            "acceptedCommunities": profile.expAcceptedCommunities,
            "acceptedJobTypes": profile.expAcceptedJobTypes,
            "minAnnualIncomeLakhs": profile.expMinAnnualIncomeLakhs,
            "acceptedLocations": profile.expAcceptedLocations,
            "goldExpectedSovereigns": profile.expGoldExpectedSovereigns,
            "houseOwnedRequired": profile.expHouseOwnedRequired,
            # New Expectations
            "minHeight": profile.expMinHeight if hasattr(profile, 'expMinHeight') else "",
            "maxHeight": profile.expMaxHeight if hasattr(profile, 'expMaxHeight') else "",
            "preferredEducation": profile.expPreferredEducation if hasattr(profile, 'expPreferredEducation') else ""
        }
    }

@router.get("")
async def get_profiles():
    profiles = await db.profile.find_many(order={"name": "asc"})
    return [format_profile_response(p) for p in profiles]

@router.post("")
async def create_profile(data: ProfileCreateSchema):
    # Flatten expectations structure for DB insertion
    payload = data.model_dump()
    exp = payload.pop("expectations")
    
    # Generate unique sequential registrationId (e.g. REG1001, REG1002)
    last_profile = await db.profile.find_first(
        order={"registrationId": "desc"}
    )
    if last_profile and last_profile.registrationId and last_profile.registrationId.startswith("REG"):
        try:
            num = int(last_profile.registrationId.replace("REG", ""))
            reg_id = f"REG{num + 1}"
        except ValueError:
            reg_id = "REG1001"
    else:
        reg_id = "REG1001"

    plain_pw = generate_password()
    payload["registrationId"] = reg_id
    payload["password"] = hash_password(plain_pw)

    # Add expectations fields
    payload["expMinAge"] = exp["minAge"]
    payload["expMaxAge"] = exp["maxAge"]
    payload["expAcceptedCommunities"] = exp["acceptedCommunities"]
    payload["expAcceptedJobTypes"] = exp["acceptedJobTypes"]
    payload["expMinAnnualIncomeLakhs"] = exp["minAnnualIncomeLakhs"]
    payload["expAcceptedLocations"] = exp["acceptedLocations"]
    payload["expGoldExpectedSovereigns"] = exp["goldExpectedSovereigns"]
    payload["expHouseOwnedRequired"] = exp["houseOwnedRequired"]
    payload["expMinHeight"] = exp.get("minHeight", "")
    payload["expMaxHeight"] = exp.get("maxHeight", "")
    payload["expPreferredEducation"] = exp.get("preferredEducation", "")

    record = await db.profile.create(data=payload)
    return format_profile_response(record, plain_password=plain_pw)

@router.put("/{id}")
async def update_profile(id: str, data: ProfileUpdateSchema):
    existing = await db.profile.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Profile not found")

    payload = data.model_dump(exclude_unset=True)
    
    # If password is explicitly updated, hash it
    if "password" in payload and payload["password"]:
        payload["password"] = hash_password(payload["password"])
    
    # If expectations is provided in updates, pop and flatten it
    if "expectations" in payload and payload["expectations"] is not None:
        exp = payload.pop("expectations")
        payload["expMinAge"] = exp["minAge"]
        payload["expMaxAge"] = exp["maxAge"]
        payload["expAcceptedCommunities"] = exp["acceptedCommunities"]
        payload["expAcceptedJobTypes"] = exp["acceptedJobTypes"]
        payload["expMinAnnualIncomeLakhs"] = exp["minAnnualIncomeLakhs"]
        payload["expAcceptedLocations"] = exp["acceptedLocations"]
        payload["expGoldExpectedSovereigns"] = exp["goldExpectedSovereigns"]
        payload["expHouseOwnedRequired"] = exp["houseOwnedRequired"]
        payload["expMinHeight"] = exp.get("minHeight", "")
        payload["expMaxHeight"] = exp.get("maxHeight", "")
        payload["expPreferredEducation"] = exp.get("preferredEducation", "")
    elif "expectations" in payload:
        payload.pop("expectations")

    record = await db.profile.update(where={"id": id}, data=payload)
    return format_profile_response(record)

@router.delete("/{id}")
async def delete_profile(id: str):
    existing = await db.profile.find_unique(where={"id": id})
    if not existing:
        raise HTTPException(status_code=404, detail="Profile not found")

    await db.profile.delete(where={"id": id})
    return {"message": "Profile deleted", "id": id}
