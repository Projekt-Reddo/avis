import axios from "./api-instance";

const apiRoute = "/notifys";

export const viewNotifyApi = async (data: NotifyFilter) => {
    const res = await axios.post(apiRoute + "/filter", data);
    return res.data;
}

export const setIsReadNotifyApi = async () => {
    const res = await axios.put(apiRoute + "/isRead");
    return res.data;
}