"""LifeOS AI — Health check endpoint."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring and connectivity verification."""
    return {
        "status": "healthy",
        "service": "lifeos-ai",
        "version": "0.1.0",
    }
