import { useEffect } from "react";
import { useHistory } from "react-router";
import { logout } from "store/slices/authSlice";
import { useAppSelector, useAppDispatch } from "./react-redux-hooks";

export const useUserChangeTracking = () => {
    const auth = useAppSelector((state) => state.auth.data);
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const tempUser = {
                ...auth,
            };

            if (auth && !tempUser.emailVerified) {
                dispatch(logout());

                history.replace("/verify", {
                    user: {
                        ...tempUser,
                    },
                });

                return;
            }
        })();
    }, [auth]);
};
