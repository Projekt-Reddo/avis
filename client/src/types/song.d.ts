interface Song {
    id: string;
    title: string;
    alias: string;
    thumbnail: string;
    lyrics: string;
    description: string;
    genres: string[];
    url?: {
        internal?: string;
        soundcloud?: string;
        spotify?: string;
        youtube?: string;
    };
    artists: Artist[];
}

interface SongFilter {
    page: number;
    size: number;
    filter?: {
        title?: string;
        genres?: string[];
        createdStart?: string;
        createdEnd?: string;
        modifiedStart?: string;
        modifiedEnd?: string;
    };
}

interface SongCreate {
    title: string;
    alias: string;
    thumbnail: File | null;
    lyrics: string;
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

interface SongDelete {
    deleteObject: {
        listId: string[];
    };
    searchFilter: any;
}
