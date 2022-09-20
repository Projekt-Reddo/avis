import axios from "api/api-instance";

const apiRoute = "/api/artists";

export const recommendArtistApi = async (keyword: string) => {
    const res = await axios.post(apiRoute + "/recommend", {
        keyword: keyword,
    });

    return res.data;
};