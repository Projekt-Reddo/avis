import { API } from "utils/constants";
import axios from "./api-instance";

const apiRoute = "/account";

export const signupApiCallAsync = async (data: User) => {
    const res = await axios.post(API + apiRoute, data);

    return res;
};
