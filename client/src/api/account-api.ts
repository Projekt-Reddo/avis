import axios from "./api-instance";

const apiRoute = "/account";

export const createAccountApi = async (data: UserCreateDto) => {
    const res = await axios.post(apiRoute + "/signup", data);

    return res.data;
};
