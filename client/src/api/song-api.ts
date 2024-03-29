import axios from "./api-instance";

const apiRoute = "/songs";

export const createSongApi = async (data: SongCreate) => {
    const formData = new FormData();
    formData.append("Title", data.title);
    formData.append("Alias", data.alias ?? "");
    formData.append("Thumbnail", data.thumbnailFile!);
    formData.append("Lyrics", data.lyrics ?? "");
    formData.append("Description", data.description ?? "");
    for (let item of data.genres) {
        formData.append("Genres", item);
    }
    formData.append("Url.Soundcloud", data.url.soundcloud ?? "");
    formData.append("Url.Spotify", data.url.spotify ?? "");
    formData.append("Url.Youtube", data.url.youtube ?? "");
    for (let item of data.artistIds) {
        formData.append("ArtistIds", item);
    }
    formData.append("File", data.file!);

    const res = await axios.post(apiRoute, formData);

    return res.data;
};

export const viewSongApi = async (data: SongFilter) => {
    const res = await axios.post(apiRoute + "/filter", data);
    return res.data;
};

export const deleteSongApi = async (data: object) => {
    const res = await axios.delete(apiRoute, { data: data });
    return res.data;
};

export const songDetailApi = async (data: string) => {
    const res = await axios.get(`${apiRoute}/${data}`);
    return res.data;
};

export const relatedSongsApi = async (data: object) => {
    const res = await axios.post(`${apiRoute}/related`, data);
    return res.data;
};

export const editSongApi = async (data: SongCreate) => {
    const formData = new FormData();
    formData.append("Title", data.title);
    formData.append("Alias", data.alias ?? "");
    formData.append("Thumbnail", data.thumbnailFile!);
    formData.append("Lyrics", data.lyrics ?? "");
    formData.append("Description", data.description ?? "");
    for (let item of data.genres) {
        formData.append("Genres", item);
    }
    formData.append("Url.Soundcloud", data.url.soundcloud ?? "");
    formData.append("Url.Spotify", data.url.spotify ?? "");
    formData.append("Url.Youtube", data.url.youtube ?? "");
    for (let item of data.artistIds) {
        formData.append("ArtistIds", item);
    }

    const res = await axios.put(`${apiRoute}/${data.id}`, formData);

    return res.data;
};
