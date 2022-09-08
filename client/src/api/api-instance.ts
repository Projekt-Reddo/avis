import axios from "axios";
import { MAIN_SERVICE_API } from "utils/constants";
import { getCurrentUserAccessToken } from "./firebase-api";

const instance = axios.create({
    baseURL: MAIN_SERVICE_API || "",
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(
    async function (config: any) {
        // Get token from firebase
        var token = await getCurrentUserAccessToken();

        // Set token to authorize header
        config.headers.Authorization = token ? `Bearer ${token}` : "";

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance;
