import os
import torch
import faiss
import numpy as np
import argparse
from models.resnet import *
from config.local_config import Config

def load_resnet():
    model = wrap_resnet_face18(False)
    model.load_state_dict(torch.load(os.path.join(config.checkpoints_path, 'resnet18_latest.pth'), map_location=torch.device('cpu'), strict=False))
    # model.to('cpu')
    model.eval()
    return model

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=str, default="/preprocessed/public_test", required=False, help="path to data")
    parser.add_argument("--output", type=str, default="/result/submission.csv", required=False, help="path to output")
    args = parser.parse_args()

    config = Config()
    parser = argparse.ArgumentParser()