import axios from "api/api-instance";

const apiRoute = "/genres";

export const recommendGenreApi = async (keyword: string) => {
    const res = await axios.post(apiRoute + "/recommend", {
        keyword: keyword,
    });

    return res.data;
};
