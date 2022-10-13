import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { currentFirebaseUser } from "api/firebase-api";
import { getUserProfile } from "api/profile-api";

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
            });
    },
});

export const viewProfileAsync = createAsyncThunk("profile/view", async () => {
    const currentUserData = currentFirebaseUser();

    const data = await getUserProfile(currentUserData?.uid!);

    return data;
});

export default profileSlice.reducer;
