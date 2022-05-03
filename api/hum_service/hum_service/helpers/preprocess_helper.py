from hum2song.config.local_config import Config
import yaml
import io
import numpy as np
import hum2song.audio as Audio
import pydub
import librosa

config = Config()
class PreprocessHelper():
    def __init__(self) -> None:
        """ 
        Initialize the class
        """
        self.config_preprocess = yaml.load(open(config.preprocess, "r"), Loader=yaml.FullLoader)
        self.sampling_rate = self.config_preprocess["preprocessing"]["audio"]["sampling_rate"]
        self.max_wav_value = self.config_preprocess["preprocessing"]["audio"]["max_wav_value"]

        self.STFT = Audio.stft.TacotronSTFT(
            self.config_preprocess["preprocessing"]["stft"]["filter_length"],
            self.config_preprocess["preprocessing"]["stft"]["hop_length"],
            self.config_preprocess["preprocessing"]["stft"]["win_length"],
            self.config_preprocess["preprocessing"]["mel"]["n_mel_channels"],
            self.config_preprocess["preprocessing"]["audio"]["sampling_rate"],
            self.config_preprocess["preprocessing"]["mel"]["mel_fmin"],
            self.config_preprocess["preprocessing"]["mel"]["mel_fmax"],
        )

        self.wav = io.BytesIO()
    
    def process(self, audio):
        """
            Process audio file
        """
        audio = audio.astype(np.float32)
        audio = audio / max(abs(audio)) * self.max_wav_value
        mel_spectrogram, _ = Audio.tools.get_mel_from_wav(audio, self.STFT)
        return mel_spectrogram.T

    def preprocess(self, hum_file):
        """ Preprocess audio file
        Args:
            hum_file: hum_file sent from client
        
        Returns:
            rs: mel_spectrogram
        
        """
        pydub.AudioSegment.from_file(hum_file.file).export(self.wav, "wav")
        audio, _ = librosa.load(self.wav, sr=self.sampling_rate)
        return self.process(audio)

    



