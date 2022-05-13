import { Route, Redirect } from "react-router-dom";
import Discussion from "../pages/Discussion";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Post from "../pages/Post";
import Search from "../pages/Search";
import Signup from "../pages/Signup";
import Song from "../pages/Song";
import { routes } from "../utils/constants";

const MainRoute = () => {
    return (
        <>
            <>
                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/signup">
                    <Signup />
                </Route>
            </>

            <>
                <Route path="/search">
                    <Search />
                </Route>

                <Route path="/song/:songId">
                    <Song />
                </Route>

                <Route path="/discussion/:postId">
                    <Post />
                </Route>

                <Route exact path="/discussion">
                    <Discussion />
                </Route>

                <Route exact path="/">
                    <Home />
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