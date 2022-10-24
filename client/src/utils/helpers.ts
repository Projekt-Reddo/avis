import md5 from "crypto-js/md5";
import { SUGAR } from "./constants";

export const hash = (data: string): string => {
    return md5(data + SUGAR).toString();
};

export const dataURLtoFile = (dataurl: any) => {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    if (mime.startsWith("audio")) {
        return new File([u8arr], "audio.mp3", { type: mime });
    }

    return new File([u8arr], mime.replace("/", "."), { type: mime });
};