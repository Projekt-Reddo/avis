import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { relatedSongsApi } from "api/song-api";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: {
        payload: [],
    },
    error: null,
};

const recommendSlice = createSlice({
    name: "recommend",
    initialState,
    reducers: {
        song: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(relatedSongsAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(relatedSongsAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data.payload = action.payload;
            });
    },
});

export const relatedSongsAsync = createAsyncThunk(
    "recommend/song",
    async (data: object) => {
        const res = await relatedSongsApi(data);

        return res;
    }
);

export const { song } = recommendSlice.actions;
export default recommendSlice.reducer;
