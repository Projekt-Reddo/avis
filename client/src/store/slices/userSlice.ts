import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAccountApi, viewUserApi } from "api/account-api";
import { loginWithGoogle, userSignupFirebase } from "api/firebase-api";
import { FirebaseError } from "firebase/app";
import { getUserData } from "pages/admin/User/View";
import { mapAuthCodeToMessage } from "utils/firebase/firebase-helpers";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: null,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signup: () => initialState,

        login: (state, action) => ({
            ...state,
            data: action.payload,
        }),

        logout: (state) => ({
            ...state,
            data: null,
        }),
        create: () => initialState,
        viewUser: (state, action) => ({
            ...state,
            data: action.payload
        }),
        setUser: (_, action) => action.payload,

    },
    extraReducers: (builder) => {
        builder
            .addCase(signupAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(signupAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(viewUserAsync.pending, (state) =>
            {
                state.status = "loading";
            })
            .addCase(viewUserAsync.fulfilled, (state,action) =>{
                state.status = "idle";
                state.data = action.payload;
                state.tableData = {
                    ...action.payload,
                    payload: getUserData(action.payload),
                };
            })
    },
});

export const signupAsync = createAsyncThunk(
    "user/signup",
    async (userSignup: UserSignup, thunkApi) => {
        try {
            // Signup here
            const userFirebaseData = await userSignupFirebase(
                userSignup as UserSignup
            );

            const res = await createAccountApi({
                email: userSignup.email,
                name: userSignup.name,
                uid: userFirebaseData.user.uid,
            });

            if (res.status !== 200) {
                return res.data.message;
            }

            return {
                emailVerified: userFirebaseData.user.emailVerified,
                email: userSignup.email,
                name: userSignup.name,
                uid: userFirebaseData.user.uid,
            };
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                thunkApi.dispatch(
                    addToast({
                        variant: "danger",
                        message: mapAuthCodeToMessage(e.code),
                    })
                );
            }
        }
    }
);

export const loginWithGoogleAsync = createAsyncThunk("user/login", async () => {
    // Login here
    const userFirebaseData = await loginWithGoogle();

    return {
        // emailVerified: userFirebaseData?.user.emailVerified,
        // email: userFirebaseData?.user.email,
        // uid: userFirebaseData?.user.uid,
    };
});

export const viewUserAsync = createAsyncThunk(
    "user/viewUser",
    async (userFilter: UserFilter) =>
    {
        return await viewUserApi(userFilter);
    }
);


export const { signup, logout } = userSlice.actions;

export const {viewUser,setUser,create} = userSlice.actions;

export default userSlice.reducer;
