import Profile from "pages/user/Profile";
import UserRoute from "./UserRoute";

import { useRouteMatch } from "react-router";

const UserRoutes = () => {
    let { path } = useRouteMatch();

    return (
        <>
            <UserRoute exact path={`${path}/profile`}>
                <Profile />
            </UserRoute>
        </>
    );
};

export default UserRoutes;
