import Profile from "pages/user/Profile";
import ProfileSave from "pages/user/ProfileSave";
import UserRoute from "./UserRoute";

import { useRouteMatch } from "react-router";

const UserRoutes = () => {
    let { path } = useRouteMatch();

    return (
        <>
            <UserRoute exact path={`${path}/profile`}>
                <Profile />
            </UserRoute>

            <UserRoute exact path={`${path}/profile/save`}>
                <ProfileSave />
            </UserRoute>
        </>
    );
};

export default UserRoutes;
