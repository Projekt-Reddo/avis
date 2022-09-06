import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userSignupFirebase } from "api/firebase-api";

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

export const signupAsync = createAsyncThunk(
    "user/signup",
    async (userSignup: UserSignup) => {
        // Signup here
        // userSignupFirebase(userSignup as UserSignup);
        console.log(userSignup);
    }
);

export const { signup, logout } = userSlice.actions;
export default userSlice.reducer;
