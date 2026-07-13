from fastapi import APIRouter, HTTPException
from prisma import Prisma
from schemas.company import CompanyProfileCreate, CompanyProfileUpdate, CompanyProfileOut

router = APIRouter(prefix="/api/company", tags=["company"])
prisma = Prisma()


@router.on_event("startup")
async def startup():
    if not prisma.is_connected():
        await prisma.connect()


@router.get("", response_model=CompanyProfileOut)
async def get_company_profile():
    """Return the single company profile record."""
    record = await prisma.companyprofile.find_first()
    if not record:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return record


@router.post("", response_model=CompanyProfileOut, status_code=201)
async def create_company_profile(data: CompanyProfileCreate):
    """Create the company profile (only one allowed)."""
    existing = await prisma.companyprofile.find_first()
    if existing:
        raise HTTPException(status_code=409, detail="Company profile already exists. Use PUT to update.")
    record = await prisma.companyprofile.create(data=data.model_dump())
    return record


@router.put("", response_model=CompanyProfileOut)
async def update_company_profile(data: CompanyProfileUpdate):
    """Update the company profile."""
    existing = await prisma.companyprofile.find_first()
    if not existing:
        raise HTTPException(status_code=404, detail="Company profile not found. Use POST to create.")
    payload = data.model_dump(exclude_unset=True)
    record = await prisma.companyprofile.update(
        where={"id": existing.id},
        data=payload,
    )
    return record
