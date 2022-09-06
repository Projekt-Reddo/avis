import crypto from "crypto";
import { SUGAR } from "./constants";

export const hash = (data: string) => {
    return crypto
        .createHash("md5")
        .update(data + SUGAR)
        .digest("hex");
};
