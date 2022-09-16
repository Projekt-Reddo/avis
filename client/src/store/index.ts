import { configureStore } from "@reduxjs/toolkit";
import songSlice from "./slices/songSlice";
import toastSlice from "./slices/toastSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        toast: toastSlice,
        song: songSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
