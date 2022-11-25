import { THEME } from "./constants";

export const leftNavAdmin: LeftNavItemData[] = [
    {
        icon: "user",
        path: "/admin/user",
        title: "User",
    },
    {
        icon: "flag",
        path: "/admin/report",
        title: "Report",
    },
    {
        icon: "music",
        path: "/admin/song",
        title: "Song",
    },
    {
        icon: "microphone",
        path: "/admin/artist",
        title: "Artist",
    },
    {
        icon: "guitar",
        path: "/admin/genre",
        title: "Genre",
    },
];

export const leftNavModerator: LeftNavItemData[] = [
    {
        icon: "user",
        path: "/moderator/user",
        title: "User",
    },
    {
        icon: "flag",
        path: "/moderator/report",
        title: "Report",
    },
];

export const leftNavOptions: {
    [key: string]: LeftNavItemData[];
} = {
    admin: leftNavAdmin,
    moderator: leftNavModerator,
};

export const displayThemeIcon = (theme: any): string => {
    if (theme.status === "idle") {
        switch (theme.data.display) {
            case THEME.DARK:
                return "moon";

            case THEME.SYSTEM:
                return "desktop";

            default:
                return "sun";
        }
    }

    return "sun";
};
