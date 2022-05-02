import pickle
import os

with open('saved_name.pkl', 'rb') as f:
    name_dict = pickle.load(f)


path = './private_test/hum/'
files = os.listdir(path)

# print(name_dict)
for index, file in enumerate(files):
    old_name = os.path.join(path, file)
    new_name = ''.join([name_dict[file.split(".")[0]+".mp3"], '.npy'])
    new_name = os.path.join(path, new_name)
    # print(old_name, new_name)
    os.rename(old_name, new_name)
