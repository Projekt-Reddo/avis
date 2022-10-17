import axios from "./api-instance";

const apiRoute = "/accounts";

export const getUserProfile = async (uid: string) => {
    const res = await axios.get(apiRoute + `/profile/${uid}`);

    return res.data;
};

export const updateUserProfile = async (
    uid: string,
    userProfileUpdateDto: ProfileUpdateDto
) => {
    const formData = new FormData();

    formData.append("Name", userProfileUpdateDto.name);

    if (userProfileUpdateDto.avatarFile) {
        formData.append("AvatarFile", userProfileUpdateDto.avatarFile);
    }

    const res = await axios.put(apiRoute + `/profile/${uid}`, formData);

    return res.data;
};
