import React from "react";
import { useHistory } from "react-router";
import { useAppSelector } from "utils/react-redux-hooks";

export const useRedirectAfterLoggedIn = (condition?: () => boolean) => {
    // Handle loading
    const userState = useAppSelector((state) => state.auth);

    const redirectUser = () => {
        if (userState.data && userState.data.emailVerified) {
            history.replace("/");
        }
    };

    // Redirect user to home after logged in
    const history = useHistory();
    React.useEffect(() => {
        if (condition === undefined || condition()) {
            return redirectUser();
        }
    }, [userState.data]);
};
