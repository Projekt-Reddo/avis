import axios from "./api-instance";

const apiRoute = "/api/songs";

export const createSongApi = async (data: SongCreate) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const res = await axios.post(apiRoute, formData);

    return res.data;
};
