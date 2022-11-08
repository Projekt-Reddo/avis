import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { THEME } from "utils/constants";
import storage from "utils/useStorage";
import { useSystemTheme } from "utils/useSystemTheme";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: {
        display: null,
        value: null,
    },
    error: null,
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTheme.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getTheme.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(setTheme.pending, (state) => {
                state.status = "loading";
            })
            .addCase(setTheme.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const getTheme = createAsyncThunk("theme/get", async () => {
    var theme: string = await storage.get("theme");

    if (!theme) {
        return {
            display: THEME.LIGHT,
            value: THEME.LIGHT,
        };
    }

    switch (theme) {
        case THEME.DARK:
            return {
                display: THEME.DARK,
                value: THEME.DARK,
            };

        case THEME.SYSTEM:
            var systemTheme = useSystemTheme();
            return {
                display: THEME.SYSTEM,
                value: systemTheme,
            };

        default:
            return {
                display: THEME.LIGHT,
                value: THEME.LIGHT,
            };
    }
});

export const setTheme = createAsyncThunk(
    "theme/set",
    async (prevTheme: string) => {
        // Round: LIGHT -> DARK -> SYSTEM -> LIGHT

        switch (prevTheme) {
            case THEME.DARK:
                await storage.set("theme", THEME.SYSTEM);
                var systemTheme = useSystemTheme();
                return {
                    display: THEME.SYSTEM,
                    value: systemTheme,
                };

            case THEME.SYSTEM:
                await storage.set("theme", THEME.LIGHT);
                return {
                    display: THEME.LIGHT,
                    value: THEME.LIGHT,
                };

            default:
                await storage.set("theme", THEME.DARK);
                return {
                    display: THEME.DARK,
                    value: THEME.DARK,
                };
        }
    }
);

export const {} = themeSlice.actions;

export default themeSlice.reducer;
