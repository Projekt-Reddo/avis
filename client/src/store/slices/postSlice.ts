import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { viewPostApi } from "api/post-api";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: {
        total: 0,
        payload: [],
    },
    error: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        viewPost: (state, action) => ({
            ...state,
            data: action.payload,
        })
    },
    extraReducers: (builder) => {
        builder
            .addCase(viewPostAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewPostAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            ;
    },
});

export const viewPostAsync = createAsyncThunk(
    "post/viewPost",
    async (postFilter: PostFilter) => {
        return await viewPostApi(postFilter);
    }
);

export const { viewPost } = postSlice.actions;
export default postSlice.reducer;
