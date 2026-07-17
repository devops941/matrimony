from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from db import db
from routers.company import router as company_router
from routers.nakshatra import router as nakshatra_router
from routers.imagekit import router as imagekit_router
from routers.community import router as community_router
from routers.nakshatra_router import router as custom_nakshatra_router
from routers.porutham_router import router as porutham_router
from routers.job_category_router import router as job_category_router
from routers.profile_router import router as profile_router

# Load environment variables
load_dotenv()

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
app.include_router(nakshatra_router)
app.include_router(imagekit_router)
app.include_router(community_router)
app.include_router(custom_nakshatra_router)
app.include_router(porutham_router)
app.include_router(job_category_router)
app.include_router(profile_router)

# Mount Socket.io
from socket_manager import init_socketio
init_socketio(app)

from match_queue import start_match_worker

@app.on_event("startup")
async def startup():
    """Connect to database on startup"""
    await db.connect()
    print("✅ Connected to MongoDB via Prisma")
    start_match_worker()
    print("🚀 Background Match Queue Worker Started")

@app.on_event("shutdown")
async def shutdown():
    """Disconnect from database on shutdown"""
    await db.disconnect()
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
        is_connected = db.is_connected()
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
