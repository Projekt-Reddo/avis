export const routes = [
    "/login",
    "/contact",
    "/signup",
    "/search",
    "/discover",
    "/song",
    "/verify",
];

export const routesIgnoreNav: string[] = ["/login", "/signup", "/verify"];

export const MAIN_SERVICE_API =
    import.meta.env.VITE_MAIN_SERVICE_API || "localhost:7000";
export const SUGAR = import.meta.env.VITE_SUGAR;

export const DefaultDay = "0001-01-01T00:00:00Z";

export const MOBILE_BREAKPOINT = 1024;
