import { configureStore } from "@reduxjs/toolkit";
import songSlice from "./slices/songSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        song: songSlice
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
