import axios from "./api-instance";

const apiRoute = "/api/songs";

export const viewSongApi = async (data: SongFilter) => {

    console.log(data)

    const res = await axios.post(apiRoute + "/filter", data);

    console.log(res)

    return res.data;
};