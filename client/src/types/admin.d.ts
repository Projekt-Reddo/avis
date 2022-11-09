interface PageRowFilterProps {
    currentPage: number;
    rowShow: {
        value: number;
        label: string;
    };
    filter?: {
        name?: string;
        sort?: string;
        joinedStart?: string;
        joinedEnd?: string;
        isModerator?: boolean;
        isBanned?: boolean;
        isMuted?: boolean;
    };
}
