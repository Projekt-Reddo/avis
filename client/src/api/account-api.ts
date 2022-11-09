import axios from "./api-instance";

const apiRoute = "/accounts";

export const createAccountApi = async (data: UserCreateDto) => {
    const res = await axios.post(apiRoute + "/signup", data);

    return res.data;
};

export const loginWithGoogleApi = async (data: UserCreateDto) => {
    const res = await axios.post(apiRoute + "/google-login", data);

    return res.data;
};

export const viewUserApi = async (data: UserFilter) => {
    const res = await axios.post(apiRoute + "/filter", data);
    return res.data;
};

export const sortListApi = async (keyword: string) => {
    const sortOptions = [
        {
            id: "631",
            name: "Name Ascending",
        },
        {
            id: "631",
            name: "Name Descending",
        },
        {
            id: "631",
            name: "Joined Date Ascending",
        },
        {
            id: "631",
            name: "Joined Date Descending",
        },
    ];

    return sortOptions;
};

export const promoteManyApi = async (data: UserUidList) => {
    const res = await axios.put(apiRoute + "/promote", data);
    return res.data;
};

export const banManyApi = async (data: UserUidList) => {
    const res = await axios.put(apiRoute + "/ban", data);
    return res.data;
};
