import faiss
import os
from tqdm import tqdm
from hum2song.utils.utils import *
import pickle
from hum2song.config.local_config import Config

config = Config()

class MyFaiss():
    def __init__(self) -> None:
        """
        Initialize the class
        
        """
        self.path = config.checkpoints_path
        self.index = faiss.IndexFlatL2(512)
        self.index2id = {"-1": ""}

    def dump_index(self):
        """ 
        Save faiss index to file
        
        """
        faiss.write_index(self.index, f"{self.path}/index.index")
    
    def load_index(self):
        """
        Load faiss index from file 

        """
        self.index = faiss.read_index(f"{self.path}/index.index")
        self.get_index2id_dict()

    def dump_index2id_dict(self):
        """
        Save index2id to file
        """
        with open(f'{self.path}/index2id.pkl', 'wb') as f:
            pickle.dump(self.index2id, f)

    def get_index2id_dict(self):
        """
        Load index2id from file
        
        """
        with open(f"{self.path}/index2id.pkl", 'rb') as f:
            self.index2id = pickle.load(f)
        return self.index2id
        

    def get_vector2index(self, model, root_song, input_shape):
        """
        Get faiss index and vecto2id from raw file 

        Args:
            model: model for creating embedding
            root_song: root path of song
            input_shape: input shape of model
        """
        list_song = os.listdir(root_song)

        # add song to index2id
        for id, name_song in tqdm(enumerate(list_song)):
            path_song = os.path.join(root_song, name_song)
            image = load_image(path_song, input_shape=input_shape)
            self.index.add(get_feature(model, image))
            self.index2id[str(id)] = name_song.split('.')[0]
        
        # self.save_index()
        self.dump_index2id_dict()
        self.dump_index()
        # self.get_index2id_dict(path=f"{self.path}/index2id.pkl")
        # print(self.index2id)

    def predict_from_files(self, model, path_hum, input_shape):
        """
        Predict from files

        Args:
            model: model for creating embedding
            path_hum: path of hum
            input_shape: input shape of model

        Returns:
            _result: array of result
        """
        image = load_image(path_hum, input_shape)
        feature = get_feature(model, image)
        _, lst_index = self.index.search(feature, k=30)
        lst_result = []
        for index in lst_index[0]:
            result = str(self.index2id[str(index)])
            if result not in lst_result:
                lst_result.append(result)
            if len(lst_result) == 10:
                break

        # _result = ''
        # for index in lst_result[:10]:
            # _result += f",{index}"

        _result = lst_result[:10]
        return _result

    def predict(self, model, image):
        image = load_image(image)
        feature = get_feature(model, image)
        _, lst_index = self.index.search(feature, k=30)
        lst_result = []
        for index in lst_index[0]:
            result = str(self.index2id[str(index)])
            if result not in lst_result:
                lst_result.append(result)
            if len(lst_result) == 10:
                break

        # _result = ''
        # for index in lst_result[:10]:
            # _result += f",{index}"

        _result = lst_result[:10]
        return _result
