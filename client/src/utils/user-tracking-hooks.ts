import { useEffect } from "react";
import { useHistory } from "react-router";
import { logout } from "store/slices/authSlice";
import { useAppSelector, useAppDispatch } from "./react-redux-hooks";

export const useUserChangeTracking = () => {
    const user = useAppSelector((state) => state.auth.data);
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const tempUser = {
                ...user,
            };

            if (user && !tempUser.emailVerified) {
                dispatch(logout());

                history.replace("/verify", {
                    ...tempUser,
                });

                return;
            }
        })();
    }, [user]);
};
