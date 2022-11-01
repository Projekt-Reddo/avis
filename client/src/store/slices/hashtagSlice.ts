import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { recommednHashtagsApi } from "api/post-api";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: null,
    error: null,
};

const hashtagSlice = createSlice({
    name: "hashtag",
    initialState,
    reducers: {
        recommend: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(recommendHashtagAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(recommendHashtagAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const recommendHashtagAsync = createAsyncThunk(
    "hashtag/recommend",
    async () => {
        const res = await recommednHashtagsApi();
        return res;
    }
);

export const { recommend } = hashtagSlice.actions;
export default hashtagSlice.reducer;
