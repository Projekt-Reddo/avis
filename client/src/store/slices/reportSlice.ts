import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createReportApi } from "api/report-api";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: null,
    error: null,
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
        recommend: (state, action) => ({
            ...state,
            data: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const createAsync = createAsyncThunk(
    "report/create",
    async (report: ReportCreate, thunkApi) => {
        try {
            const res = await createReportApi(report);

            thunkApi.dispatch(
                addToast({
                    variant: "primary",
                    message: res.message,
                })
            );
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

export const { recommend } = reportSlice.actions;
export default reportSlice.reducer;
