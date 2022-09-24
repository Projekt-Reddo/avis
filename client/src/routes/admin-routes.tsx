import ViewSong from "pages/admin/Song/View";
import ViewUser from "pages/admin/User/View"
import CreateSong from "pages/admin/Song/Create";

import { Route, useRouteMatch } from "react-router";

const AdminRoutes = () => {
    let { path } = useRouteMatch();

    return (
        <>
            <Route exact path={path}>
                <div>Here is dashboard</div>
            </Route>

            <Route exact path={`${path}/user`}>
                <ViewUser />
            </Route>

            <Route exact path={`${path}/song`}>
                <ViewSong />
            </Route>

            <Route path={`${path}/song/create`}>
                <CreateSong />
            </Route>
        </>
    );
};

export default AdminRoutes;
