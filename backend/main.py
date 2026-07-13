from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from prisma import Prisma
from routers.company import router as company_router

# Load environment variables
load_dotenv()

# Initialize Prisma Client
prisma = Prisma()

app = FastAPI(
    title="Community Matrimony & Porutham Matcher API",
    description="Backend API for Tamil Matrimony matching system",
    version="1.0.0"
)

# Get CORS origins from environment
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# CORS configuration to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(company_router)

@app.on_event("startup")
async def startup():
    """Connect to database on startup"""
    await prisma.connect()
    print("✅ Connected to MongoDB via Prisma")

@app.on_event("shutdown")
async def shutdown():
    """Disconnect from database on shutdown"""
    await prisma.disconnect()
    print("🔴 Disconnected from MongoDB")

@app.get("/")
async def root():
    """Root endpoint - Backend is running confirmation"""
    return {
        "message": "Community Matrimony & Porutham Matcher Backend is Running! ✅",
        "status": "operational",
        "version": "1.0.0",
        "database": "Prisma + MongoDB",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "api": "/api"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check if Prisma is connected
        is_connected = prisma.is_connected()
        return {
            "status": "healthy",
            "service": "matrimony-backend",
            "database": "connected" if is_connected else "disconnected",
            "prisma": "active"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "matrimony-backend",
            "database": "error",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    
    # Get host and port from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    # Print startup message
    print("\n" + "="*60)
    print(f"🚀 Community Matrimony & Porutham Matcher Backend")
    print("="*60)
    print(f"📍 Server running at:")
    print(f"   Local:   http://localhost:{port}")
    
    print("="*60 + "\n")
    
    uvicorn.run("main:app", host=host, port=port, reload=True)
