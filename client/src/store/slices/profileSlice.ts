import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { currentFirebaseUser } from "api/firebase-api";
import { getUserProfile, updateUserProfile } from "api/profile-api";

const initialState: AsyncReducerInitialState = {
    status: "init",
    data: null,
    error: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(viewProfileAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(viewProfileAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.data = action.payload;
            })
            .addCase(updateProfileAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                state.status = "idle";
            });
    },
});

export const viewProfileAsync = createAsyncThunk(
    "profile/view",
    async (uid: string | undefined | null) => {
        if (uid) {
            // View others profile
            const data = await getUserProfile(uid!);
            return data;
        } else {
            // View own profile
            const currentUserData = currentFirebaseUser();
            const data = await getUserProfile(currentUserData?.uid!);
            return data;
        }
    }
);

export const updateProfileAsync = createAsyncThunk(
    "profile/update",
    async (userProfileUpdateDto: ProfileUpdateDto) => {
        try {
            const currentUserData = currentFirebaseUser();

            const data = await updateUserProfile(
                currentUserData?.uid!,
                userProfileUpdateDto
            );

            if (data) {
                if (data.avatar && typeof data.avatar == "string") {
                    URL.revokeObjectURL(data.avatar);
                }

                window.location.reload();
            }

            return data;
        } catch (e: unknown) {
            console.log(e);
        }
    }
);

export default profileSlice.reducer;
