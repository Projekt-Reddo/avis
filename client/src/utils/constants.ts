export const routes = [
    "/login",
    "/contact",
    "/signup",
    "/search",
    "/discover",
    "/song",
];

export const routesIgnoreNav: string[] = ["/login", "/signup"];

export const API = import.meta.env.VITE_API_URL || "localhost:7000";
export const SUGAR = import.meta.env.VITE_SUGAR;

export const DefaultDay = "0001-01-01T00:00:00Z";
