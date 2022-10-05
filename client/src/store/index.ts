import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import leftNavSlice from "./slices/leftNavSlice";
import songSlice from "./slices/songSlice";
import searchSlide from "./slices/searchSlice";
import toastSlice from "./slices/toastSlice";
import userSlice from "./slices/userSlice";
import recommendSlice from "./slices/recommendSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        song: songSlice,
        search: searchSlide,
        toast: toastSlice,
        leftNavShowing: leftNavSlice,
        recommend: recommendSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
