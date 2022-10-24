import axios from "./api-instance";

const apiRoute = "/posts";

export const viewPostApi = async (data: PostFilter) => {
    const res = await axios.post(apiRoute + "/filter", data);
    return res.data;
};

export const recommednHashtagsApi = async () => {
    const res = await axios.get(apiRoute + "/recommend");
    return res.data;
};

export const postDetailApi = async (id: string) => {
    const res = await axios.get(`${apiRoute}/${id}`);
    return res.data;
};
