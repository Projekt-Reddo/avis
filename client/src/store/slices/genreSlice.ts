import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { recommendGenreApi } from "api/genre-api";

const initialState: AsyncReducerInitialState = {
    status: "idle",
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

export const { recommend } = genreSlice.actions;
export default genreSlice.reducer;
