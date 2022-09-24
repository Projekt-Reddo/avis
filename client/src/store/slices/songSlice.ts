import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSongApi, viewSongApi, humToSongApi } from "api/song-api";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: {
        total: 0,
        payload: [],
    },
    error: null,
    tableData: [],
};

const songSlice = createSlice({
    name: "song",
    initialState,
    reducers: {
        create: () => initialState,
        viewSong: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        setTableData: (state, action) => {
            return {
                ...state,
                tableData: action.payload,
            };
        },
        humToSong: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(viewSongAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewSongAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
                state.tableData = action.payload.payload;
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

export const createAsync = createAsyncThunk(
    "song/create",
    async (songCreate: SongCreate, thunkApi) => {
        try {
            const res = await createSongApi(songCreate);
            const msg = res.message;

            thunkApi.dispatch(
                addToast({
                    variant: "primary",
                    message: msg,
                })
            );
            return msg;
        } catch (e: any) {
            thunkApi.dispatch(
                addToast({
                    variant: "danger",
                    message: e.response.data.message,
                })
            );
        }
    }
);

export const viewSongAsync = createAsyncThunk(
    "song/viewSong",
    async (songFilter: SongFilter) => {
        return await viewSongApi(songFilter);
    }
);

export const humToSongAsync = createAsyncThunk(
    "song/hum",
    async (blob: Blob) => {
        return await humToSongApi(blob);
    }
);

export const { viewSong, setTableData, create } = songSlice.actions;
export default songSlice.reducer;
