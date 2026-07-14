import os
import uuid
import time
import hmac
import hashlib
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/imagekit", tags=["imagekit"])

@router.get("/auth")
async def get_imagekit_auth():
    """
    Generate signature, token, and expiration timestamp for ImageKit.io
    client-side direct file uploads.
    """
    private_key = os.getenv("IMAGEKIT_PRIVATE_KEY")
    if not private_key:
        raise HTTPException(
            status_code=500,
            detail="ImageKit private key is not configured in backend environment variables."
        )

    # Generate a unique token
    token = str(uuid.uuid4())

    # Set expiration time (e.g., 30 minutes from now)
    expire = int(time.time() + 1800)

    # Calculate HMAC-SHA1 signature of (token + expire)
    message = f"{token}{expire}"
    signature = hmac.new(
        key=private_key.encode("utf-8"),
        msg=message.encode("utf-8"),
        digestmod=hashlib.sha1
    ).hexdigest()

    return {
        "token": token,
        "expire": expire,
        "signature": signature
    }