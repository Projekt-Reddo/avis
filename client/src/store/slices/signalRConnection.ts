import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { MAIN_SERVICE_HUB } from "utils/constants";

const initialState: HubConnection | null = null;

const signalRSlice = createSlice({
    name: "signalR",
    initialState,
    reducers: {},
});

export const {} = signalRSlice.actions;
export default signalRSlice.reducer;

export const startConnection = createAsyncThunk(
    "signalR/connect",
    async (_, thunkApi) => {
        const connection = new HubConnectionBuilder()
            .withUrl(MAIN_SERVICE_HUB)
            .withAutomaticReconnect()
            .build();

        await connection.start();

        // connection.on("ReceiveMessage", () => {
        //     thunkApi.dispatch(...);
        // });

        return connection;
    }
);
