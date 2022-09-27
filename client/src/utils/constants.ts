export const routes = [
    "/login",
    "/contact",
    "/signup",
    "/search",
    "/discover",
    "/song",
    "/verify",
    "/admin",
    "/feedback",
    "/notification"
];

export const routesIgnoreNav: string[] = ["/login", "/signup", "/verify"];

export const leftNavAdmin: LeftNavItemData[] = [
    {
        icon: "home",
        path: "/admin/dashboard",
        title: "Dashboard",
    },
    {
        icon: "user",
        path: "/admin/user",
        title: "User",
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
        icon: "flag",
        path: "/admin/report",
        title: "Report",
    },
];

export const leftNavUser: LeftNavItemData[] = [];

export const MAIN_SERVICE_API =
    import.meta.env.VITE_MAIN_SERVICE_API || "localhost:7000";
export const SUGAR = import.meta.env.VITE_SUGAR;

export const DefaultDay = "0001-01-01T00:00:00Z";
export const DayFormat = "YYYY MMM DD";

export const MOBILE_BREAKPOINT = 1024;

export const HISTORY = "history";
