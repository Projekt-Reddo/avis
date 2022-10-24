import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createPostApi, postDetailApi, viewPostApi } from "api/post-api";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "init",
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
        }),
        viewMorePost: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        createPost: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPostAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createPostAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(viewPostAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewPostAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(viewMorePostAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = {
                    total: action.payload.total,
                    payload: [...state.data.payload, ...action.payload.payload],
                };
            })
            .addCase(postDetailAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(postDetailAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const viewPostAsync = createAsyncThunk(
    "post/viewPost",
    async (postFilter: PostFilter) => {
        return await viewPostApi(postFilter);
    }
);

export const viewMorePostAsync = createAsyncThunk(
    "post/viewMorePost",
    async (postFilter: PostFilter) => {
        return await viewPostApi(postFilter);
    }
);

export const createPostAsync = createAsyncThunk(
    "song/create",
    async (postCreate: PostCreate, thunkApi) => {
        try {
            const res = await createPostApi(postCreate);
            const msg = res.message;

            thunkApi.dispatch(
                addToast({
                    variant: "primary",
                    message: msg,
                })
            );
        } catch (e: any) {
            thunkApi.dispatch(
                addToast({
                    variant: "danger",
                    message: e.response.data.message,
                })
            );
        }
        return await viewPostApi({
            page: 1,
            size: 10,
            filter: {},
        });
    }
);

export const postDetailAsync = createAsyncThunk(
    "post/detail",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await postDetailApi(id);
            return res;
        } catch (e: any) {
            return rejectWithValue(e.response.data.message);
        }
    }
);

export const { viewPost, viewMorePost } = postSlice.actions;
export default postSlice.reducer;
