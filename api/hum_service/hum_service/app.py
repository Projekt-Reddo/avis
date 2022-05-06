from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routers import songs
from .dependencies import *
import logging

# region Logger

logger = logging.getLogger(__name__)

# endregion


# region FastAPI instance

app = FastAPI(dependencies=[Depends(singleton_s3_service),
                            Depends(singleton_hum2song_model),
                            Depends(singleton_faiss_index),
                            Depends(singleton_preprocessHelper)
                            ])

# endregion


# region CORS middleware

origins = [
    "http://localhost:3000",  # React dev
    "https://localhost:7179",  # Dotnet dev https
    "http://localhost:5253"  # Dotnet dev http
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# endregion


# region Routers

app.include_router(songs.router)

# endregion


@app.get("/")
async def root():
    """
    Default endpoint of the API.
    """

    return {"message": "Hello World"}
