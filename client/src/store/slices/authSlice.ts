import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAccountApi } from "api/account-api";
import {
    loginWithGoogle,
    userLoginFirebase,
    userSignupFirebase,
} from "api/firebase-api";
import { FirebaseError } from "firebase/app";
import { mapAuthCodeToMessage } from "utils/firebase/firebase-helpers";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "idle",
    data: null,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
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
            .addCase(loginAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            });
    },
});

export const loginAsync = createAsyncThunk(
    "auth/login",
    async (userLogin: UserLoginDto, thunkApi) => {
        try {
            const userFirebaseData = await userLoginFirebase(userLogin);

            const tokenResult = await userFirebaseData.user.getIdTokenResult();

            return {
                emailVerified: userFirebaseData.user.emailVerified,
                uid: userFirebaseData.user.uid,
                role: tokenResult.claims["role"],
                email: userFirebaseData.user.email,
                name:
                    tokenResult.claims["name"] ||
                    userFirebaseData.user.displayName ||
                    "Kuhaku",
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

export const signupAsync = createAsyncThunk(
    "auth/signup",
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

export const loginWithGoogleAsync = createAsyncThunk("auth/login", async () => {
    // Login here
    const userFirebaseData = await loginWithGoogle();

    return {
        // emailVerified: userFirebaseData?.user.emailVerified,
        // email: userFirebaseData?.user.email,
        // uid: userFirebaseData?.user.uid,
    };
});

export const { signup, logout } = authSlice.actions;

export default authSlice.reducer;
