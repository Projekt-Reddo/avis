import faiss
import time
import json
import os
import pydub
import librosa

from .services.s3_service import S3Service
from hum2song.config.local_config import Config
from hum2song.utils.utils import *
from hum2song.models.resnet import *
from hum2song.models.myfaiss import *
from .helpers.preprocess_helper import PreprocessHelper

# region AWS S3

s3_service = S3Service("awss3demo")
async def singleton_s3_service():
    return s3_service

# endregion

# check if file exist
def check_file_exist(file_path):
    """
    Check if file exist

    Args:
        file_path: file path

    Returns:
        rs: True if exist, False if not exist
    """
    rs = os.path.exists(file_path)
    return rs


# download checkpoint
def download_checkpoint(checkpoint_name):
    """
    Download resnet checkpoint

    Args:
        checkpoint_name: checkpoint name

    Returns:
        rs: True if success, False if fail
    """
    rs = s3_service.download_file(
        "awss3demo-bucket", "hum2song_config", checkpoint_name, "hum2song/checkpoints")
    return rs

config = Config()

def auto_init_checkpoint():
    """ 
    Check if all checkpoints are downloaded, if not, download them
    """
    files = [config.hum2song_embeded, config.faiss_index, config.index2id]
    for file in files:
        if (check_file_exist(os.path.join(config.checkpoints_path, file)) == False):
            download_checkpoint(file)

# region Hum2Song
start_time_load_model = time.time()

auto_init_checkpoint()

model = wrap_resnet_face18(False)
model.load_state_dict(torch.load(os.path.join(
    config.checkpoints_path, 'resnet18_latest.pth'), map_location=torch.device('cpu')))
model.to('cpu')
model.eval()

print('TIME LOAD EMBEDDING MODEL: ', time.time() - start_time_load_model)
async def singleton_hum2song_model():
    return model
    
# endregion


# region Hum2Song
start_time_load_model = time.time()
faiss_index = MyFaiss()
faiss_index.load_index()
print('TIME LOAD FAISS INDEX: ', time.time() - start_time_load_model)

async def singleton_faiss_index():
    return faiss_index

# endregion

# region mp3 preprocess helper
preprocessHelper = PreprocessHelper()
async def singleton_preprocessHelper():
    return preprocessHelper
# endregion
