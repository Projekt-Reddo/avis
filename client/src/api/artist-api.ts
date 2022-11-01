import axios from "api/api-instance";

const apiRoute = "/artists";

export const recommendArtistApi = async (keyword: string) => {
    const res = await axios.post(apiRoute + "/recommend", {
        keyword: keyword,
    });

    return res.data;
};

export const listArtistsApi = async (filter: ArtistFilter) => {
    const res = await axios.post(apiRoute + "/filter", filter);
    return res.data;
};

export const createArtistApi = async (artistCreateDto: ArtistCreateDto) => {
    const formData = new FormData();

    formData.append("Name", artistCreateDto.name);

    if (artistCreateDto.alias) {
        formData.append("Alias", artistCreateDto.alias);
    }

    if (artistCreateDto.thumbnailFile) {
        formData.append("ThumbnailFile", artistCreateDto.thumbnailFile);
    }

    const res = await axios.post(apiRoute, formData);
    return res.data;
};
