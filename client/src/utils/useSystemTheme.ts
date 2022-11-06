import { THEME } from "./constants";

export const useSystemTheme = () => {
    var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    return isDarkTheme ? THEME.DARK : THEME.LIGHT;
};
