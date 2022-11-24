import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commentCreateApi, viewCommentApi } from "api/comment-api";
import { addToast } from "./toastSlice";

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
        deleteComment: (state, action) => ({
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
            })
            .addCase(createCommentAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createCommentAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
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

export const createCommentAsync = createAsyncThunk(
    "comment/create",
    async (comment: CommentCreate, thunkApi) => {
        try {
            var rs = await commentCreateApi(comment);
            return await viewCommentApi({
                page: 1,
                size: 10,
                filter: {
                    objectId: comment.postId
                        ? comment.postId
                        : comment.commentId,
                    isPostChild: comment.postId ? true : false,
                    sort: "CreateAt Descending",
                },
            });
        } catch (e: any) {
            thunkApi.dispatch(
                addToast({
                    variant: "warning",
                    message: e.response.data.message,
                })
            );
        }
    }
);

export const { viewComment, viewMoreComment, deleteComment } =
    commentSlice.actions;
export default commentSlice.reducer;
