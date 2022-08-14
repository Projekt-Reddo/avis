from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers.api import router as api_router
from app.core.config import config
from app.dependencies import \
    singleton_s3_service, singleton_hum2song_model, \
    singleton_faiss_index, singleton_preprocessHelper


def get_application():
    application = FastAPI(
        title=config.app_name,
        docs_url=f"{config.api_prefix}/docs",
        redoc_url=f"{config.api_prefix}/redoc",
        openapi_url=f"{config.api_prefix}/openapi.json",
        dependencies=[
            Depends(singleton_s3_service),
            Depends(singleton_hum2song_model),
            Depends(singleton_faiss_index),
            Depends(singleton_preprocessHelper)
        ]
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=config.origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix=config.api_prefix)

    return application


app = get_application()
