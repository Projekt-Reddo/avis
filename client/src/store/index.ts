import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import leftNavSlice from "./slices/leftNavSlice";
import songSlice from "./slices/songSlice";
import searchSlide from "./slices/searchSlice";
import toastSlice from "./slices/toastSlice";
import userSlice from "./slices/userSlice";
import postSlice from "./slices/postSlice";
import songRecommendSlice from "./slices/songRecommendSlice";
import hashtagSlice from "./slices/hashtagSlice";
import genreSlice from "./slices/genreSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        song: songSlice,
        post: postSlice,
        hashtag: hashtagSlice,
        search: searchSlide,
        toast: toastSlice,
        leftNavShowing: leftNavSlice,
        songRecommend: songRecommendSlice,
        genre: genreSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
