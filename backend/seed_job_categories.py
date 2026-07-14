import asyncio, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from db import db

CATEGORIES = [
    "IT & Software",
    "Medical / Doctor",
    "Business / Entrepreneur",
    "Finance / CA",
    "Government Service",
    "Teacher / Professor",
    "Engineering",
    "Law / Legal",
    "Arts & Design",
    "Agriculture",
    "Others",
]

async def main():
    await db.connect()
    seeded = 0
    for name in CATEGORIES:
        existing = await db.jobcategory.find_unique(where={"name": name})
        if not existing:
            await db.jobcategory.create(data={"name": name, "isActive": True})
            seeded += 1
            print(f"  [OK] Seeded: {name}")
        else:
            print(f"  [--] Exists: {name}")
    print(f"\nDone. {seeded} categories seeded.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
