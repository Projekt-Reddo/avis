import { useEffect } from "react";
import { startConnection } from "store/slices/signalRConnection";
import { useAppDispatch, useAppSelector } from "./react-redux-hooks";

export const useHubConnection = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (authState.data) {
            dispatch(startConnection());
        }
    }, [authState.data]);
};
