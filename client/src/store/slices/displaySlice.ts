import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: null,
    error: null,
};

const displaySlice = createSlice({
    name: "display",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(viewArtistAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewArtistAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const viewArtistAsync = createAsyncThunk("display/view", async () => {});

export const {} = displaySlice.actions;

export default displaySlice.reducer;
