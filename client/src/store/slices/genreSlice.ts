import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    recommendGenreApi,
    viewGenreApi,
    createGenreApi,
    deleteGenreApi,
} from "api/genre-api";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: null,
    error: null,
};

const genreSlice = createSlice({
    name: "genre",
    initialState,
    reducers: {
        recommend: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(recommendAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(recommendAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(viewAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(createAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(deleteAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const recommendAsync = createAsyncThunk(
    "genre/recommend",
    async (keyword: string) => {
        const res = await recommendGenreApi(keyword);

        return res;
    }
);

export const viewAsync = createAsyncThunk("genre/view", async () => {
    const res = await viewGenreApi();

    return res;
});

export const createAsync = createAsyncThunk(
    "genre/create",
    async (names: string[], thunkApi) => {
        try {
            const res = await createGenreApi(names);

            thunkApi.dispatch(
                addToast({
                    variant: "primary",
                    message: res.message,
                })
            );
            return await viewGenreApi();
        } catch (e: any) {
            thunkApi.dispatch(
                addToast({
                    variant: "warning",
                    message: e.response.data.message,
                })
            );
            return await viewGenreApi();
        }
    }
);

export const deleteAsync = createAsyncThunk(
    "genre/delete",
    async (ids: string[], thunkApi) => {
        try {
            const res = await deleteGenreApi(ids);

            thunkApi.dispatch(
                addToast({
                    variant: "primary",
                    message: res.message,
                })
            );
            return await viewGenreApi();
        } catch (e: any) {
            thunkApi.dispatch(
                addToast({
                    variant: "warning",
                    message: e.response.data.message,
                })
            );
            return await viewGenreApi();
        }
    }
);

export const { recommend } = genreSlice.actions;
export default genreSlice.reducer;
