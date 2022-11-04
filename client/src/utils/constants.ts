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
    "/notification",
    "/user",
    "/profile",
];

export const routesIgnoreNav: string[] = ["/login", "/signup", "/verify"];
export const authRoutes = ["/login", "/signup"];

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
        icon: "guitar",
        path: "/admin/genre",
        title: "Genre",
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
export const DefaultDay_2 = "0001-01-01T00:00:00";
export const DAY_FORMAT = "YYYY MMM DD";

export const MOBILE_BREAKPOINT = 1024;

export const HISTORY = "history";

export const TIME_TO_HUM = 12;

export const LEFT_NAV_MIN_SWIPE_DISTANCE = 150;

export const REPORT_TYPE = {
    NUDITY: "Nudity",
    VIOLENCE: "Violence",
    SPAM: "Spam",
    HATE_SPEECH: "Hate Speech",
    TERROISM: "Terroism",
    SOMETHING_ELSE: "Something Else",
};

export const COMMENT_LENGTH = 280;

export const THEME = {
    DARK: "dark",
    LIGHT: "light",
    SYSTEM: "system",
};
