import axios from "./api-instance";

const apiRoute = "/search";

export const textSearchApi = async (data: string) => {
    const res = await axios.post(apiRoute + "/song" + `?keyword=${data}`);

    return res.data;
};

export const humToSongApi = async (data: Blob) => {
    const formData = new FormData();
    formData.append("inputFile", data);

    const res = await axios.post(apiRoute + "/song/hum", formData);

    return res.data;
};
