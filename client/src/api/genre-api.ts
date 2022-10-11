import axios from "api/api-instance";

const apiRoute = "/genres";

export const recommendGenreApi = async (keyword: string) => {
    const res = await axios.post(apiRoute + "/recommend", {
        keyword: keyword,
    });

    return res.data;
};

export const viewGenreApi = async () => {
    const res = await axios.get(apiRoute);

    return res.data;
};

export const createGenreApi = async (genres: string[]) => {
    const res = await axios.post(apiRoute, {
        names: genres,
    });

    return res.data;
};

export const deleteGenreApi = async (ids: string[]) => {
    const res = await axios.delete(apiRoute, {
        data: {
            ids: ids,
        },
    });

    return res.data;
};
