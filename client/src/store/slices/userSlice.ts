import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: "sekai",
    reducers: {
        testUser: (state, action) => action.payload,

        logout: (state) => "",
    },
});

export const { testUser, logout } = userSlice.actions;
export default userSlice.reducer;