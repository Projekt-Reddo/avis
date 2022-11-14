import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setIsReadNotifyApi, viewNotifyApi } from "api/notification-api";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: null,
    error: null,
};

const notifySlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        viewNotify: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        viewMoreNotify: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        addNotify: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        setIsReadNotify: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(viewNotifyAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewNotifyAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(setIsReadNotifyAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(setIsReadNotifyAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(viewMoreNotifyAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = {
                    total: action.payload.total,
                    payload: [...state.data.payload, ...action.payload.payload],
                };
            })
            .addCase(addNotifyAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = {
                    payload: [action.payload, ...state.data.payload],
                };
            });
    },
});

export const addNotifyAsync = createAsyncThunk(
    "notification/addNotify",
    async (notify: Notify) => {
        return notify;
    }
);

export const viewNotifyAsync = createAsyncThunk(
    "notification/viewNotify",
    async (notifyFilter: NotifyFilter) => {
        return await viewNotifyApi(notifyFilter);
    }
);

export const viewMoreNotifyAsync = createAsyncThunk(
    "notification/viewMoreNotify",
    async (notifyFilter: NotifyFilter) => {
        return await viewNotifyApi(notifyFilter);
    }
);

export const setIsReadNotifyAsync = createAsyncThunk(
    "notification/setIsReadNotify",
    async (_, thunkApi) => {
        try {
            await setIsReadNotifyApi();
        } catch (e: any) {
            thunkApi.dispatch(
                addToast({
                    variant: "danger",
                    message: "something wrong",
                })
            );
        }
        return await viewNotifyApi({
            page: 1,
            size: 10,
            filter: {},
        });
    }
);

export const { viewNotify, viewMoreNotify, addNotify } = notifySlice.actions;
export default notifySlice.reducer;
