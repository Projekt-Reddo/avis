import { Route, Redirect, useLocation } from "react-router-dom";
import { authRoutes } from "utils/constants";
import { useAppSelector } from "utils/react-redux-hooks";

const AuthRoute: React.FC<any> = ({ component: Component, ...rest }) => {
    const authState = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (authState.status === "init") {
        return <></>;
    }

    if (authRoutes.some((route) => location.pathname.startsWith(route))) {
        if (authState.data) {
            return <Redirect to="/" />;
        }
    }

    return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default AuthRoute;
