import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState: ToastType[] = [];

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        addToast: (state, action) => {
            // Generate unique id for a toast
            const uniqueId = uuidv4();

            // There are maximum of 3 toasts on the screen, so remove the first one if it have 3
            if (state.length === 3) {
                state.shift();
            }

            // Add new toast
            state.push({
                ...action.payload,
                id: uniqueId,
            });
        },

        // Remove the toast that has the inputed id
        removeToast: (state, action) =>
            state.filter((item) => item.id !== action.payload.id),
    },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
