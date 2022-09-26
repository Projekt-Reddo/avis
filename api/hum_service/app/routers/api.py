from fastapi import APIRouter

from app.routers import songs, health

router = APIRouter()

router.include_router(
    songs.router,
    tags=["songs"],
    prefix="/songs",
)

router.include_router(
    health.router,
    tags=["health"],
    prefix="/health"
)
