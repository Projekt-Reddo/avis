import axios from "./api-instance";

const apiRoute = "/vote";

export const voteApi = async (data: Vote) => {
    const res = await axios.put(apiRoute, data);
    return res.data;
}