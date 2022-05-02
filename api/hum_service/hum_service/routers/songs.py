from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import magic
from hum_service.services.s3_service import S3Service
from ..dependencies import singleton_s3_service

# Create an instance of the router
router = APIRouter(
    prefix="/songs",
    tags=["songs"],
)


@router.post("/hum", response_class=JSONResponse)
async def hum_detect(hum_file: UploadFile = File(..., description="Hum file to detect song")):
    """
    Detect song from hum file.

    :param hum_file: Hum file to detect song
    """

    # Check file extension
    if (hum_file.content_type not in ["audio/mpeg", "audio/mp3"]):
        raise HTTPException(400, detail="MP3 extension required")

    # Check MIME type
    # Rememer to install python-magic-bin in windows to use this OR libmagic1 in linux
    mime = magic.Magic(mime=True)
    mine_result = mime.from_buffer(hum_file.file.read(1024))
    if (mine_result not in ["audio/mpeg", "audio/mp3", "application/octet-stream"]):
        raise HTTPException(400, detail="MP3 MIME type required")

    return {"fileName": hum_file.filename}


@router.post("/down", response_class=JSONResponse)
async def download_file(s3_service: S3Service = Depends(singleton_s3_service)):

    rs = s3_service.download_file(
        "awss3demo-bucket", "img", "61961754_p0.jpg", "hum2song/checkpoints")

    if rs:
        return {"message": "File downloaded successfully"}

    return {"message": "Fail to download file"}
