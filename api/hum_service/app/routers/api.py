from fastapi import APIRouter

from app.routers import songs

router = APIRouter()

router.include_router(
    songs.router,
    tags=["songs"],
    prefix="/songs",
)
