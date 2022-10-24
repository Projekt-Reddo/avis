import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postDetailApi, viewPostApi } from "api/post-api";

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
