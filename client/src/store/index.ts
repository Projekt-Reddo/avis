import { configureStore } from "@reduxjs/toolkit";
import toastSlice from "./slices/toastSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        toast: toastSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
