import axios from "./api-instance";

const apiRoute = "/posts";

export const viewPostApi = async (data: PostFilter) => {
    const res = await axios.post(apiRoute + "/filter", data);
    return res.data;
};
