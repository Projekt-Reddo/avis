import axios from "./api-instance";

const apiRoute = "/accounts";

export const createAccountApi = async (data: UserCreateDto) => {
    const res = await axios.post(apiRoute + "/signup", data);

    return res.data;
};
