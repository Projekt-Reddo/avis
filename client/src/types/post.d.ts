interface PostFilter {
    page: number;
    size: number;
    filter?: {
        content?: string;
        hashtags?: string[];
    };
}