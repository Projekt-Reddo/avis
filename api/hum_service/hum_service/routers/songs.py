from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import magic
from hum_service.services.s3_service import S3Service
from ..dependencies import singleton_faiss_index, singleton_hum2song_model, singleton_preprocessHelper, singleton_s3_service
import time
# Create an instance of the router
router = APIRouter(
    prefix="/songs",
    tags=["songs"],
)


@router.post("/hum", response_class=JSONResponse)
async def hum_detect(hum_file: UploadFile = File(..., description="Hum file to detect song"),
model = Depends(singleton_hum2song_model),
faiss_index = Depends(singleton_faiss_index),
preprocessHelper = Depends(singleton_preprocessHelper)
):
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


    # Detect song
    # start_time_detect = time.time()
#     # preprocess file
#     # r.seek = lambda *args: None  # allow pydub to call seek(0)
#     pydub.AudioSegment.from_file(hum_file.file).export(wav, "wav")
#     audio, _ = librosa.load(wav, sr=sampling_rate)
#     spec = process(audio, max_wav_value, STFT)
    spec = preprocessHelper.preprocess(hum_file)
    result_ = faiss_index.predict(model, spec)
    return {"result": result_}


@router.post("/down", response_class=JSONResponse)
async def download_file(s3_service: S3Service = Depends(singleton_s3_service)):

    rs = s3_service.download_file(
        "awss3demo-bucket", "img", "61961754_p0.jpg", "hum2song/checkpoints")

    if rs:
        return {"message": "File downloaded successfully"}

    return {"message": "Fail to download file"}
