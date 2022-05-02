import os, json, faiss
from models.myfaiss import *
from models.resnet import *
from utils.utils import *
# from tqdm import tqdm
from config.config import Config
import time
import argparse

config = Config()
start_time_load_model = time.time()
model = wrap_resnet_face18(False)
model.load_state_dict(torch.load(os.path.join(config.checkpoints_path, 'resnet18_latest.pth')))
model.to('cuda')
model.eval()
print('TIME LOAD MODEL: ', time.time() - start_time_load_model)

faiss_index = MyFaiss()
faiss_index.get_vector2index(model, os.path.join("/preprocessed/", "full_song"))



if __name__ == '__main__':
    # parser = argparse.ArgumentParser()
    # parser.add_argument("--data", type=str, default="/preprocessed/public_test", required=False, help="path to data")
    # parser.add_argument("--output", type=str, default="/result/submission.csv", required=False, help="path to output")
    # args = parser.parse_args()

    # config = Config()
    # parser = argparse.ArgumentParser()
    start_time_infer = time.time()
    
    # os.makedirs(os.path.dirname(args.output), exist_ok=True)

    # is_song = 'song' if os.path.isdir(os.path.join(args.data, 'song')) else 'full_song'
    # create_submit(os.path.join(args.data, is_song),
    #               os.path.join(args.data, 'hum'),
    #               args.output,
    #               config.input_shape)
    print('TIME INFERENCE :', time.time() - start_time_infer)
