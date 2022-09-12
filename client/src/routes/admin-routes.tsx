import ViewSong from "pages/admin/Song/View";
import { Route, useRouteMatch } from "react-router";

const AdminRoutes = () => {
    let { path } = useRouteMatch();

    return (
        <>
            <Route exact path={path}>
                <div>Here is dashboard</div>
            </Route>

            <Route path={`${path}/users`}>
                <div>Here is user management</div>
            </Route>

            <Route path={`${path}/songs`}>
                <ViewSong />
            </Route>
        </>
    );
};

export default AdminRoutes;
