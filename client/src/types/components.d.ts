type ButtonVariantsType = {
    [key: string]: {
        backgroundColor: string;
        color: string;
    };
};

type ButtonVariantNameType = "primary" | "secondary" | "danger";

interface PageFilterProps {
    currentPage: number;
    rowShow: number;
    filter?: {
        userId?: string;
        content?: string;
        hashtags?: string[];
        isTrending?: boolean;
    };
}
