from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import magic

from ..dependencies import singleton_demo, demo, Demo

# Create an instance of the router
router = APIRouter(
    prefix="/songs",
    tags=["songs"],
)


@router.post("/hum", response_class=JSONResponse)
async def hum_detect(hum_file: UploadFile = File(..., description="Hum file to detect song"), local_demo: Demo = Depends(demo)):
    """
    Detect song from hum file.

    :param hum_file: Hum file to detect song
    """

    # instance = await singleton_demo()

    local_demo.__call__()

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
