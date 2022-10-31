interface Artist {
    id: string;
    name: string;
    thumbnail?: string;
}

interface ArtistFilter {
    page: number;
    size: number;
    filter?: {
        name?: string;
    };
}

interface ArtistFilterState {
    currentPage: number;
    rowShow: {
        value: number;
        label: string;
    };
    filter: {
        name?: string;
    };
}

interface ArtistCreateDto {
    name: string;
    alias?: string;
    thumbnailFile?: File;
}
