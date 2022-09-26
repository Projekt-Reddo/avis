from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from app.dependencies import (
    singleton_faiss_index,
    singleton_hum2song_model,
    singleton_preprocessHelper
)

router = APIRouter()


@router.post("/hum", response_class=JSONResponse)
async def hum_detect(
    hum_file: UploadFile = File(..., description="Hum file to detect song"),
    model=Depends(singleton_hum2song_model),
    faiss_index=Depends(singleton_faiss_index),
    preprocessHelper=Depends(singleton_preprocessHelper)
):
    """
    Detect song from hum file.

    :param hum_file: Hum file to detect song
    """

    if (hum_file.content_type not in ["audio/mpeg", "audio/mp3"]):
        raise HTTPException(400, detail="MP3 extension required")

    # mime = magic.Magic(mime=True)
    # mine_result = mime.from_buffer(hum_file.file.read(1024))
    # if (mine_result not in [
    #     "audio/mpeg", "audio/mp3", "application/octet-stream",
    # ]):
    #     raise HTTPException(400, detail="MP3 MIME type required")

    spec = preprocessHelper.preprocess(hum_file)
    result_ = faiss_index.predict(model, spec)
    return {"result": preprocessHelper.postprocess_results(result_)}
