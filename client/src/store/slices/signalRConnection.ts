import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { MAIN_SERVICE_HUB } from "utils/constants";
import { addNotifyAsync } from "./notifySlice";
import { getCurrentUserAccessToken } from "api/firebase-api";

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
        var token = await getCurrentUserAccessToken();

        const connection = new HubConnectionBuilder()
            .withUrl(MAIN_SERVICE_HUB + "?access_token=" + token)
            .withAutomaticReconnect()
            .build();

        await connection.start();

        connection.on("Receive Notification", (notify: Notify) => {
            thunkApi.dispatch(
                addNotifyAsync(notify)
            );
        });

        return connection;
    }
);
