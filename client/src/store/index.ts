import { configureStore } from "@reduxjs/toolkit";
import leftNavSlice from "./slices/leftNavSlice";
import songSlice from "./slices/songSlice";
import toastSlice from "./slices/toastSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        song: songSlice,
        toast: toastSlice,
        leftNavShowing: leftNavSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
