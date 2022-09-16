import axios from "./api-instance";

const apiRoute = "/api/songs";

export const viewSongApi = async (data: SongFilter) => {
    const res = await axios.post(apiRoute + "/filter", data);
    return res.data;
};