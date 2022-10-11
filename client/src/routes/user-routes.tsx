import Profile from "pages/user/Profile";
import UserRoute from "./UserRoute";

const UserRoutes = () => {
    return (
        <>
            <UserRoute exact path={`/profile`}>
                <Profile />
            </UserRoute>
        </>
    );
};

export default UserRoutes;
