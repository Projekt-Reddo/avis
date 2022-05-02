
import pickle
import pandas as pd

with open('saved_name.pkl', 'rb') as f:
    name_dict = pickle.load(f)

print(name_dict)

df = pd.read_csv("submission.csv", header=None)
df = df.astype(str)

for index, row in df.iterrows():
    # print(str(row[0])[:-4])
    df.iloc[index,0] = name_dict[str(df.iloc[index,0])]
    # df.loc[index, 1:] = name_dict[str(row[1])]
    for i in range(1, 10+1):
        df.iloc[index, i] = name_dict[str(row[i])+".mp3"]

print(df.head())
df.to_csv("converted_test_submission.csv", index=False, header=["hum", "song1", "song2", "song3", "song4", "song5", "song6", "song7", "song8", "song9", "song10"])
