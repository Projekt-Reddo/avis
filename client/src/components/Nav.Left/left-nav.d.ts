interface LeftNavItemData {
    icon: string | string[];
    path?: string;
    title: string;
    isActive?: boolean;
    isShown?: boolean;
    onClick?: () => void;
}

type ShowingStateType = "show" | "hide";
