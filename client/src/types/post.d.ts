interface PostFilter {
    page: number;
    size: number;
    filter?: {
        content?: string;
        hashtags?: string[];
        isTrending?: boolean;
    };
}

interface UserPostFilter{
    page: number;
    size: number;
    filter?: {
        userId: string;
    };
}

interface Post {
    id: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar: string;
        role: string;
    };
    content: string;
    medias: [{ id: string; mediaType: string; url: string }];
    createdAt: string;
    modifiedAt: string;
    publishedAt: string;
    upvotedBy: string[];
    downvotedBy: string[];
    hashtags: [];
    commentCount: number;
}

interface PostCreate {
    content: string;
    medias: string[];
    hashtags: string[];
    publishedAt: string;
    displayStatus: string;
}