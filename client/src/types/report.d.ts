interface ReportCreate {
    type: string;
    content?: string;
    postId?: string;
    commentId?: string;
}

interface Report {
    id: string;
    createdAt: string;
    modifiedAt: string;
    user: User;
    content?: string;
    type: string;
    post?: Post;
    comment?: Comment;
    status?: string;
    confirmedBy: User;
}

interface ReportFilter {
    page: number;
    size: number;
    filter?: {
        from?: Date;
        to?: Date;
        isPost?: boolean;
        type?: string;
    };
}

interface ReportFilterState {
    currentPage: number;
    rowShow: {
        value: number;
        label: string;
    };
    filter?: {
        from?: Date;
        to?: Date;
        isPost?: string;
        type?: string;
    };
}

interface ReportConfirm {
    ids: string[];
    isAccepted: boolean;
    filter: ReportFilterState;
}
