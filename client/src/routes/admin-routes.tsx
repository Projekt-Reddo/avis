import ViewSong from "pages/admin/Song/View";
import ViewUser from "pages/admin/User/View";
import CreateSong from "pages/admin/Song/Create";

import { useRouteMatch } from "react-router";
import AdminRoute from "./AdminRoute";

const AdminRoutes = () => {
    let { path } = useRouteMatch();

    return (
        <>
            <AdminRoute exact path={path}>
                <div>Here is dashboard</div>
            </AdminRoute>

            <AdminRoute exact path={`${path}/user`}>
                <ViewUser />
            </AdminRoute>

            <AdminRoute exact path={`${path}/song`}>
                <ViewSong />
            </AdminRoute>

            <AdminRoute path={`${path}/song/create`}>
                <CreateSong />
            </AdminRoute>
        </>
    );
};

export default AdminRoutes;
