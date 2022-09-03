export const routes = [
    "/login",
    "/contact",
    "/signup",
    "/search",
    "/discover",
    "/song",
];

export const routesIgnoreNav: string[] = ["/login", "/signup"];

// @ts-ignore
export const API = import.meta.env.REACT_APP_API_URL || "localhost:7000";
export const DefaultDay = "0001-01-01T00:00:00Z";
