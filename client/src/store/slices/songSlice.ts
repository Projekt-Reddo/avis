import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { viewSongApi } from "api/song-api";
import { getSongData } from "pages/admin/Song/View";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: {
        total: 0,
        payload:[]
    },
    error: null,
    tableData: {
        total: 0,
        payload:[]
    },
}

const songSlice = createSlice({
    name: "song",
    initialState,
    reducers: {

        viewSong: (state, action) => ({
            ...state,
            data: action.payload,
        }),

        setSong: (_, action) => (action.payload)

    },

    extraReducers: (builder) =>{
        builder
            .addCase(viewSongAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewSongAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
                state.tableData = {
                    ... action.payload,
                    payload: getSongData(action.payload)
                }
            })
    }
});

export const viewSongAsync = createAsyncThunk("song/viewSong", async (songFilter: SongFilter) =>{
    return await viewSongApi(songFilter);
});

export default songSlice.reducer;
export const { viewSong, setSong } = songSlice.actions;