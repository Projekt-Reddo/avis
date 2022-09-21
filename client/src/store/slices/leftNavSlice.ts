import { createSlice } from "@reduxjs/toolkit";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { getWindowDimensions } from "utils/useWindowDimensions";

const initialState =
    !(getWindowDimensions().width! < MOBILE_BREAKPOINT) || false;

const leftNavSlice = createSlice({
    name: "leftnav",
    initialState,
    reducers: {
        toggleLeftNav: (state) => !state,
    },
});

export const { toggleLeftNav } = leftNavSlice.actions;
export default leftNavSlice.reducer;
