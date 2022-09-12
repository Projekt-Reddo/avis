interface SongCreateDto {
    title: string;
    alias: string;
    thumbnail: File | null;
    lyric: string;
    description: string;
    genres: string[];
    url: {
        soundcloud: string;
        spotify: string;
        youtube: string;
    };
    artistIds: string[];
    file: File | null;
}
