import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    confirmReportsApi,
    createReportApi,
    getReportApi,
} from "api/report-api";
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
        setTableData: (state, action) => ({
            ...state,
            tableData: action.payload,
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
            })
            .addCase(getAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
                state.tableData = action.payload.payload;
            })
            .addCase(confirmAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(confirmAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
                state.tableData = action.payload.payload;
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

export const getAsync = createAsyncThunk(
    "report/get",
    async (filter: ReportFilter, { rejectWithValue }) => {
        try {
            const res = await getReportApi(filter);
            return res;
        } catch (e: any) {
            return rejectWithValue(
                e.response.data.message ?? "Fail to load reports"
            );
        }
    }
);

export const confirmAsync = createAsyncThunk(
    "report/confirm",
    async (reportConfirm: ReportConfirm, thunkApi) => {
        try {
            const res = await confirmReportsApi(reportConfirm);

            thunkApi.dispatch(
                addToast({
                    variant: "primary",
                    message: res.message,
                })
            );

            return await getReportApi({
                page: reportConfirm.filter.currentPage,
                size: reportConfirm.filter.rowShow.value,
                filter: {
                    from: reportConfirm.filter.filter?.from,
                    to: reportConfirm.filter.filter?.to,
                    type: reportConfirm.filter.filter?.type,
                    // @ts-ignore
                    isPost:
                        reportConfirm.filter.filter?.isPost === "true"
                            ? true
                            : reportConfirm.filter.filter?.isPost === "false"
                            ? false
                            : null,
                },
            });
        } catch (e: any) {
            thunkApi.dispatch(
                addToast({
                    variant: "danger",
                    message: e.response.data.message,
                })
            );
        }
    }
);

export const { recommend, setTableData } = reportSlice.actions;
export default reportSlice.reducer;
