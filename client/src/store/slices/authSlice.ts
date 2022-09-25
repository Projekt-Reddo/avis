import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { createAccountApi, loginWithGoogleApi } from "api/account-api";
import {
    currentFirebaseUser,
    loginWithGoogle,
    userLoginFirebase,
    userSignupFirebase,
} from "api/firebase-api";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import { mapAuthCodeToMessage } from "utils/firebase/firebase-helpers";
import { addToast } from "./toastSlice";

const initialState: AsyncReducerInitialState = {
    status: "init",
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
            .addMatcher(
                isAnyOf(
                    signupAsync.pending,
                    loginAsync.pending,
                    loginWithGoogleAsync.pending,
                    firstCheckin.pending
                ),
                (state) => {
                    state.status = "loading";
                }
            )
            .addMatcher(
                isAnyOf(
                    signupAsync.fulfilled,
                    loginAsync.fulfilled,
                    loginWithGoogleAsync.fulfilled,
                    firstCheckin.fulfilled
                ),
                (state, action) => {
                    state.status = "idle";
                    state.data = action.payload;
                }
            );
    },
});

export const firstCheckin = createAsyncThunk("auth/checkin", async () => {
    const firebaseUser = currentFirebaseUser();

    if (!firebaseUser) return null;

    return await getUserDataState(firebaseUser);
});

export const loginAsync = createAsyncThunk(
    "auth/login",
    async (userLogin: UserLoginDto, thunkApi) => {
        try {
            const userFirebaseData = await userLoginFirebase(userLogin);

            return await getUserDataState(userFirebaseData.user);
        } catch (e: unknown) {
            handleError(e, thunkApi);
        }
    }
);

export const signupAsync = createAsyncThunk(
    "auth/signup",
    async (userSignup: UserSignup, thunkApi) => {
        try {
            // Signup with Firebase
            const userFirebaseData = await userSignupFirebase(
                userSignup as UserSignup
            );

            // Add firebase data to back-end
            const res = await createAccountApi({
                email: userSignup.email,
                name: userSignup.name,
                uid: userFirebaseData.user.uid,
                avatar: userFirebaseData.user.photoURL,
            });

            if (res.status === 200) {
                return await getUserDataState(userFirebaseData.user);
            }
        } catch (e: unknown) {
            handleError(e, thunkApi);
        }
    }
);

export const loginWithGoogleAsync = createAsyncThunk(
    "auth/login",
    async (_, thunkApi) => {
        try {
            // Login here.
            const userFirebaseData = await loginWithGoogle();

            var tokenResult = await userFirebaseData.user.getIdTokenResult();

            // Check if the user account had been added to back-end database or not.
            if (!tokenResult.claims["initiated"]) {
                const res = await loginWithGoogleApi({
                    uid: userFirebaseData.user.uid,
                    avatar: userFirebaseData.user.photoURL,
                    email: userFirebaseData.user.email!,
                    name: userFirebaseData.user.displayName!,
                });

                if (res.status === 200) {
                    return await getUserDataState(userFirebaseData.user);
                }
            } else {
                return await getUserDataState(userFirebaseData.user);
            }
        } catch (e: any) {
            handleError(e, thunkApi);
        }
    }
);

export const { signup, logout } = authSlice.actions;

export default authSlice.reducer;

// Get data from Firebase return to add to Redux
async function getUserDataState(userFirebaseData: User) {
    const tokenResult = await userFirebaseData.getIdTokenResult();

    return {
        emailVerified: userFirebaseData.emailVerified,
        uid: userFirebaseData.uid,
        role: tokenResult.claims["role"],
        email: userFirebaseData.email,
        name:
            tokenResult.claims["name"] ||
            userFirebaseData.displayName ||
            "Kuhaku",
    };
}

// Display toast based on error
function handleError(e: unknown, thunkApi: any) {
    if (e instanceof FirebaseError) {
        // User close popup
        if (e.code === "auth/popup-closed-by-user") return;

        thunkApi.dispatch(
            addToast({
                variant: "danger",
                message: mapAuthCodeToMessage(e.code),
            })
        );
    }
}
