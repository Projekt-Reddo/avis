import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signup: () => initialState,

        logout: (state) => ({
            ...state,
            data: null,
        }),
    },
});

export const signupAsync = createAsyncThunk("user/signup", async () => {
    // Signup here
});

export const { signup, logout } = userSlice.actions;
export default userSlice.reducer;
