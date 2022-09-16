import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSongApi } from "api/song-api";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: null,
    error: null,
};

const songSlice = createSlice({
    name: "song",
    initialState,
    reducers: {
        create: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const createAsync = createAsyncThunk(
    "song/create",
    async (songCreate: SongCreate, thunkApi) => {
        const res = await createSongApi(songCreate);
        const msg = res.data.message;

        if (res.status !== 200) {
            thunkApi.dispatch(
                addToast({
                    variant: "danger",
                    message: msg,
                })
            );

            return msg;
        }

        thunkApi.dispatch(
            addToast({
                variant: "primary",
                message: msg,
            })
        );

        return msg;
    }
);

export const { create } = songSlice.actions;
export default songSlice.reducer;
