interface CommentFilter {
    page: number;
    size: number;
    filter?: {
        objectId?: string;
        isPostChild?: boolean;
    };
}

interface Comment {
    id: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar: string;
        role: string;
    };
    content: string;
    media: { id: string; mediaType: string; url: string };
    comments: string[];
    createdAt: string;
    modifiedAt: string;
    publishedA: string;
    upvotedBy: string[];
    downvotedBy: string[];
}

interface CommentCreate {
    commentId?: string;
    postId?: string;
    userId: string;
    content: string;
    media?: File;
}
