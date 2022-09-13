type ToastType = {
    id: string;
    message: string;
    variant: ToastVariantNameType;
};

type ToastCreateType = {
    message: string;
    variant?: ToastVariantNameType;
};

type ToastVariantsType = {
    [key: string]: {
        backgroundColor: string;
        icon: string | string[];
    };
};

type ToastVariantNameType = "primary" | "info" | "danger" | "warning";
