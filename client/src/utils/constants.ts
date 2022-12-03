export const routes = [
    "/login",
    "/forgot",
    "/contact",
    "/signup",
    "/search",
    "/discover",
    "/song",
    "/verify",
    "/feedback",
    "/notification",
    "/profile",
    // Role routes
    "/user",
    "/moderator",
    "/admin",
];

export const routesIgnoreNav: string[] = ["/login", "/signup", "/verify"];
export const authRoutes = ["/login", "/signup"];

export const USER_ROLE = {
    ADMIN: "admin",
    MODERATOR: "moderator",
    USER: "user",
};

export const MAIN_SERVICE_API =
    import.meta.env.VITE_MAIN_SERVICE_API || "localhost:7000";
export const SUGAR = import.meta.env.VITE_SUGAR;
export const MAIN_SERVICE_HUB = import.meta.env.VITE_MAIN_SERVICE_HUB;

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

export const PLATFORM = {
    WEB: "web",
    IOS: "ios",
    ANDROID: "android",
};
