import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { viewCommentApi } from "api/comment-api";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: {
        total: 0,
        payload: [],
    },
    error: null,
};

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        viewComment: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        viewMoreComment: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(viewCommentAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewCommentAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(viewMoreCommentAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = {
                    total: action.payload.total,
                    payload: [...state.data.payload, ...action.payload.payload],
                };
            });
    },
});

export const viewCommentAsync = createAsyncThunk(
    "comment/viewComment",
    async (commentFilter: CommentFilter) => {
        return await viewCommentApi(commentFilter);
    }
);

export const viewMoreCommentAsync = createAsyncThunk(
    "comment/viewMoreComment",
    async (commentFilter: CommentFilter) => {
        return await viewCommentApi(commentFilter);
    }
);

export const { viewComment, viewMoreComment } = commentSlice.actions;
export default commentSlice.reducer;
