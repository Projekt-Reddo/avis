import time
import os
from app.services.s3_service import S3Service
from hum2song.config.local_config import Config
from hum2song.models.resnet import (
    wrap_resnet_face18,
)
from hum2song.models.myfaiss import (
    torch,
    MyFaiss,
)
from app.helpers.preprocess_helper import PreprocessHelper
from app.core.log_config import logger
from app.core.config import config as app_config

# region AWS S3

s3_service = S3Service()


async def singleton_s3_service():
    return s3_service

# endregion

# check if file exist


def __is_file_exist(file_path: str) -> bool:
    """
    Check if file exist
    """
    rs = os.path.exists(file_path)
    return rs


# download checkpoint
def __download_checkpoint(checkpoint_name: str) -> bool:
    """
    Download resnet checkpoint
    """
    rs = s3_service.download_file(
        bucket_name=app_config.ml_bucket,
        prefix=app_config.ckpt_folder,
        file_name=checkpoint_name,
        target_dir="hum2song/checkpoints")
    return rs


config = Config()


def auto_init_checkpoint():
    """
    Check if all checkpoints are downloaded, if not, download them
    """
    files = [config.hum2song_embeded, config.faiss_index, config.index2id]
    for file in files:
        if (__is_file_exist(
            os.path.join(config.checkpoints_path, file)
        ) is False):
            __download_checkpoint(file)


# region Hum2Song

start_time_load_model = time.time()

auto_init_checkpoint()

model = wrap_resnet_face18(False)
model.load_state_dict(
    torch.load(os.path.join(
        config.checkpoints_path, 'resnet18_latest.pth'),
        map_location=torch.device('cpu')
    ))
model.to('cpu')
model.eval()

logger.debug(
    f"TIME LOAD EMBEDDING MODEL: {time.time() - start_time_load_model}"
)


async def singleton_hum2song_model():
    return model

# endregion


# region Hum2Song

start_time_load_model = time.time()
faiss_index = MyFaiss()
faiss_index.load_index()
logger.debug(f"TIME LOAD FAISS INDEX: {time.time() - start_time_load_model}")


async def singleton_faiss_index():
    return faiss_index

# endregion

# region mp3 preprocess helper

preprocessHelper = PreprocessHelper()


async def singleton_preprocessHelper():
    return preprocessHelper

# endregion
