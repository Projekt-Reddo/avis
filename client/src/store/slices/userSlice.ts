import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { viewUserApi } from "api/account-api";
import { getUserData } from "pages/admin/User/View";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: {
        total: 0,
        payload: [],
    },
    error: null,
    tableData: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        create: () => initialState,
        viewUser: (state, action) => ({
            ...state,
            data: action.payload,
        }),
        setUser: (state, action) => ({
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

            .addCase(viewUserAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewUserAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
                state.tableData = action.payload.payload;
            });
    },
});

export const viewUserAsync = createAsyncThunk(
    "user/viewUser",
    async (userFilter: UserFilter) => {
        return await viewUserApi(userFilter);
    }
);

export const { viewUser, setUser, create, setTableData } = userSlice.actions;

export default userSlice.reducer;
