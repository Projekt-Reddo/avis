import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listArtistsApi } from "api/artist-api";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: null,
    error: null,
};

const artistSlice = createSlice({
    name: "artist",
    initialState,
    reducers: {
        setTableData: (state, action) => ({
            ...state,
            tableData: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(viewArtistAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewArtistAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
                state.tableData = action.payload.payload;
            });
    },
});

export const viewArtistAsync = createAsyncThunk(
    "artist/view",
    async (filter: ArtistFilter) => {
        const data = await listArtistsApi(filter);
        return data;
    }
);

export const { setTableData } = artistSlice.actions;

export default artistSlice.reducer;
