import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commentDetailApi } from "api/comment-api";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: {
        total: 0,
        payload: [],
    },
    error: null,
};

const commentDetailSlice = createSlice({
    name: "commentDetail",
    initialState,
    reducers: {
        viewCommentDetail: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(commentDetailAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(commentDetailAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const commentDetailAsync = createAsyncThunk(
    "commentDetail/viewCommentDetail",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await commentDetailApi(id);
            return res;
        } catch (e: any) {
            return rejectWithValue(e.response.data.message);
        }
    }
);

export const { viewCommentDetail } = commentDetailSlice.actions;
export default commentDetailSlice.reducer;
