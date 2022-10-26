import md5 from "crypto-js/md5";
import { SUGAR } from "./constants";

export const hash = (data: string): string => {
    return md5(data + SUGAR).toString();
};
