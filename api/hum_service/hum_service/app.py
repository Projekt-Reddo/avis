import faiss
import json
import os
import pydub
import hum2song.audio as Audio
import librosa
import yaml
import io
import pandas as pd
import argparse
import time
from hum2song.config.local_config import Config
from hum2song.utils.utils import *
from hum2song.models.resnet import *
from hum2song.models.myfaiss import *
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routers import songs
from .dependencies import singleton_s3_service
import logging
# from tqdm import tqdm

# region Logger

logger = logging.getLogger(__name__)

# endregion

# region Dependency moving

config = Config()
start_time_load_model = time.time()
model = wrap_resnet_face18(False)
model.load_state_dict(torch.load(os.path.join(
    config.checkpoints_path, 'resnet18_latest.pth'), map_location=torch.device('cpu')))
model.to('cpu')
model.eval()
print('TIME LOAD EMBEDDING MODEL: ', time.time() - start_time_load_model)

start_time_load_model = time.time()
faiss_index = MyFaiss()
faiss_index.load_index()
print('TIME LOAD FAISS INDEX: ', time.time() - start_time_load_model)


# # load preprocess mp3 helper
config_preprocess = yaml.load(
    open("./hum2song/config/preprocess.yaml", "r"), Loader=yaml.FullLoader)

sampling_rate = config_preprocess["preprocessing"]["audio"]["sampling_rate"]
max_wav_value = config_preprocess["preprocessing"]["audio"]["max_wav_value"]

STFT = Audio.stft.TacotronSTFT(
    config_preprocess["preprocessing"]["stft"]["filter_length"],
    config_preprocess["preprocessing"]["stft"]["hop_length"],
    config_preprocess["preprocessing"]["stft"]["win_length"],
    config_preprocess["preprocessing"]["mel"]["n_mel_channels"],
    config_preprocess["preprocessing"]["audio"]["sampling_rate"],
    config_preprocess["preprocessing"]["mel"]["mel_fmin"],
    config_preprocess["preprocessing"]["mel"]["mel_fmax"],
)


def process(audio, max_wav_value, STFT):
    audio = audio.astype(np.float32)
    audio = audio / max(abs(audio)) * max_wav_value
    mel_spectrogram, _ = Audio.tools.get_mel_from_wav(audio, STFT)
    return mel_spectrogram.T


wav = io.BytesIO()

# endregion

# region FastAPI instance

app = FastAPI(dependencies=[Depends(singleton_s3_service)])

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

# @app.post("/hum", response_class=JSONResponse)
# async def hum_detect(hum_file: UploadFile = File(..., description="Hum file to detect song")):

#     # Check file extension
#     if (hum_file.content_type not in ["audio/mpeg", "audio/mp3"]):
#         raise HTTPException(400, detail="MP3 extension required")

#     # Check MIME type
#     # Rememer to install python-magic-bin in windows to use this OR libmagic1 in linux
#     mime = magic.Magic(mime=True)
#     flag = mime.from_buffer(hum_file.file.read(1024))
#     # if (flag not in ["audio/mpeg", "audio/mp3"]):
#     #     raise HTTPException(400, detail="MP3 MIME type required")

#     # print(type(hum_file.file))
#     # Detect song
#     start_time_detect = time.time()
#     # preprocess file
#     # r.seek = lambda *args: None  # allow pydub to call seek(0)
#     pydub.AudioSegment.from_file(hum_file.file).export(wav, "wav")
#     audio, _ = librosa.load(wav, sr=sampling_rate)
#     spec = process(audio, max_wav_value, STFT)

#     result_ = faiss_index.predict(model, spec)

#     return {"result": result_}
