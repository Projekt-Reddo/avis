import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createPostApi, postDetailApi, viewPostApi, viewSavedPostApi, viewUserPostApi } from "api/post-api";
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
        viewUserPost: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        viewMoreUserPost: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        createPost: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        viewSavedPost: (state,action) =>({
            ...state,
            data: action.payload
        }),
        viewMoreSavedPost: (state,action) =>({
            ...state,
            data: action.payload
        })
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
            .addCase(viewUserPostAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewUserPostAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(viewMoreUserPostAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = {
                    total: action.payload.total,
                    payload: [...state.data.payload, ...action.payload.payload],
                };
            })
            .addCase(viewSavedPostAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewSavedPostAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = {
                    total: action.payload.total,
                    payload: [...state.data.payload, ...action.payload.payload],
                };
            })
            .addCase(viewMoreSavedPostAsync.fulfilled, (state, action) => {
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
    "post/createPost",
    async (postCreate: PostCreate, thunkApi) => {
        try {
            await createPostApi(postCreate);
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

export const viewUserPostAsync = createAsyncThunk(
    "post/viewUserPost",
    async (postFilter: UserPostFilter) => {
        return await viewUserPostApi(postFilter);
    }
);

export const viewMoreUserPostAsync = createAsyncThunk(
    "post/viewMoreUserPost",
    async (postFilter: UserPostFilter) => {
        return await viewUserPostApi(postFilter);
    }
);

export const viewSavedPostAsync = createAsyncThunk(
    "post/save",
    async (postFilter: PostFilter) => {
        return await viewSavedPostApi(postFilter);
    }
);

export const viewMoreSavedPostAsync = createAsyncThunk(
    "post/saveMore",
    async (postFilter: PostFilter) => {
        return await viewSavedPostApi(postFilter);
    }
);

export default postSlice.reducer;

export const { viewPost, viewMorePost, viewUserPost, viewMoreUserPost } = postSlice.actions;

