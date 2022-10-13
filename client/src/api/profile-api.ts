import axios from "./api-instance";

const apiRoute = "/accounts";

export const getUserProfile = async (uid: string) => {
    const res = await axios.get(apiRoute + `/profile/${uid}`);

    return res.data;
};
