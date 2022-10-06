import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { textSearchApi, humToSongApi } from "api/search-api";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: {
        total: 0,
        payload: null,
    },
    error: null,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        textSearch: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        humSearch: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(textSearchAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(textSearchAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data.payload = action.payload;
            })
            .addCase(humToSongAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(humToSongAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data.payload = action.payload;
            });
    },
});

export const textSearchAsync = createAsyncThunk(
    "search/song",
    async (keyword: string) => {
        return await textSearchApi(keyword);
    }
);

export const humToSongAsync = createAsyncThunk(
    "search/song/hum",
    async (blob: Blob) => {
        return await humToSongApi(blob);
    }
);

export const { textSearch, humSearch } = searchSlice.actions;
export default searchSlice.reducer;
