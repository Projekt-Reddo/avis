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

export const createPostApi = async (data: PostCreate) => {
    const formData = new FormData();
    formData.append("Content", data.content ?? "");
    for(let item of data.medias!){
        formData.append("Medias", item);
    }
    for (let item of data.hashtags) {
        formData.append("HashTags", item);
    }
    formData.append("PublishedAt", data.publishedAt ?? "");
    formData.append("DisplayStatus", data.displayStatus ?? "public");

    const res = await axios.post(apiRoute, formData);

    return res.data;
};

export const postDetailApi = async (id: string) => {
    const res = await axios.get(`${apiRoute}/${id}`);
    return res.data;
};

export const savePost = async (id: string) => {
    const res = await axios.put(`${apiRoute}/save/${id}`);
    return res.data;
}

export const viewUserPostApi = async (data: UserPostFilter) => {
    const res = await axios.post(apiRoute + "/account", data);
    return res.data;
};

export const viewSavedPostApi = async (data: PostFilter) => {
    const res = await axios.post(apiRoute + "/save", data);
    return res.data;
};