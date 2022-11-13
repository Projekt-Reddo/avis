import { Route, Redirect } from "react-router-dom";

import Home from "pages/Home";
import Login from "pages/auth/Login";
import Post from "pages/Post";
import Comment from "pages/Comment";
import Signup from "pages/auth/Signup";
import Song from "pages/Song";
import Discover from "pages/Discover";
import VerifyEmail from "pages/auth/VerifyEmail";

import AdminRoutes from "./admin-routes";
import UserRoutes from "./user-routes";

import { routes } from "../utils/constants";
import Feedback from "pages/Feedback";
import AuthRoute from "./AuthRoute";
import Search from "pages/Search";
import Profile from "pages/user/Profile";
import ModeratorRoutes from "./moderator-routes";

const MainRoute = () => {
    return (
        <>
            <>
                <AuthRoute path="/login">
                    <Login />
                </AuthRoute>

                <AuthRoute path="/signup">
                    <Signup />
                </AuthRoute>

                <AuthRoute path="/verify">
                    <VerifyEmail />
                </AuthRoute>
            </>

            <>
                <Route path="/song/:songId">
                    <Song />
                </Route>

                <Route exact path="/search/discover">
                    <Search />
                </Route>

                <Route exact path="/discover/:postId">
                    <Post />
                </Route>

                <Route path="/discover/comment/:commentId">
                    <Comment />
                </Route>

                <Route exact path="/discover">
                    <Discover />
                </Route>

                <Route path="/feedback">
                    <Feedback />
                </Route>

                <Route exact path="/">
                    <Home />
                </Route>

                <Route exact path="/profile/:uid">
                    <Profile />
                </Route>

                <Route path="/user">
                    <UserRoutes />
                </Route>

                <Route path="/moderator">
                    <ModeratorRoutes />
                </Route>

                <Route path="/admin">
                    <AdminRoutes />
                </Route>

                <Route
                    render={({ location }) =>
                        !routes.some((route) =>
                            location.pathname.startsWith(route)
                        ) &&
                        location.pathname !== "/" && <Redirect to="/" />
                    }
                />
            </>
        </>
    );
};

export default MainRoute;
