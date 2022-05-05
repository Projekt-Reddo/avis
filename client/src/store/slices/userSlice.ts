import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: "sekai",
    reducers: {
        testUser: (state, action) => action.payload,
    },
});

export const { testUser } = userSlice.actions;
export default userSlice.reducer;
