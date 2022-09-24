import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { viewUserApi } from "api/account-api";
import { getUserData } from "pages/admin/User/View";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: null,
    error: null,
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
        setUser: (_, action) => action.payload,
    },
    extraReducers: (builder) => {
        builder

            .addCase(viewUserAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewUserAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
                state.tableData = {
                    ...action.payload,
                    payload: getUserData(action.payload),
                };
            });
    },
});

export const viewUserAsync = createAsyncThunk(
    "user/viewUser",
    async (userFilter: UserFilter) => {
        return await viewUserApi(userFilter);
    }
);

export const { viewUser, setUser, create } = userSlice.actions;

export default userSlice.reducer;
