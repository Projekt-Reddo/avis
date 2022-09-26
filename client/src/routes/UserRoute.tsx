import { Route, Redirect } from "react-router-dom";
import { useAppSelector } from "utils/react-redux-hooks";

const UserRoute: React.FC<any> = ({ component: Component, ...rest }) => {
    const user = useAppSelector((state) => state.auth);

    if (!user) {
        return <Redirect to="/" />;
    }

    return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default UserRoute;
