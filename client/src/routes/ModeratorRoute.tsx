import { Route, Redirect, useLocation } from "react-router-dom";
import { useAppSelector } from "utils/react-redux-hooks";

const ModeratorRoute: React.FC<any> = ({ component: Component, ...rest }) => {
    const authState = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (authState.status === "init") return <></>;

    if (location.pathname.startsWith("/moderator")) {
        if (!authState.data || authState.data.role !== "moderator") {
            return <Redirect to="/" />;
        }
    }

    return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ModeratorRoute;
