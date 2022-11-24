import axios from "./api-instance";

const apiRoute = "/comments";

export const viewCommentApi = async (data: CommentFilter) => {
    const res = await axios.post(apiRoute + "/filter", data);
    return res.data;
};

export const commentDetailApi = async (id: string) => {
    const res = await axios.get(`${apiRoute}/${id}`);
    return res.data;
};

export const commentCreateApi = async (comment: CommentCreate) => {
    var formData = new FormData();
    formData.append("UserId", comment.userId);
    formData.append("Content", comment.content);
    if (comment.postId) {
        formData.append("PostId", comment.postId);
    } else {
        formData.append("CommentId", comment.commentId!);
    }
    if (comment.media) {
        formData.append("Media", comment.media);
    }

    const res = await axios.post(apiRoute, formData);
    return res.data;
};

export const deleteComment = async (id: string) => {
    const res = await axios.delete(`${apiRoute}/${id}`);
    return res.data;
};
