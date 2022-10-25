import axios from "./api-instance";

const apiRoute = "/comments";

export const viewCommentApi = async (data: CommentFilter) => {
    const res = await axios.post(apiRoute + "/filter", data);
    return res.data;
};
