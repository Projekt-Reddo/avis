import ViewSong from "pages/admin/Song/View";
import ViewUser from "pages/admin/User/View";
import CreateSong from "pages/admin/Song/Create";
import EditSong from "pages/admin/Song/Edit";
import Dashboard from "pages/admin/Dashboard";
import Genre from "pages/admin/Genre";

import { useRouteMatch } from "react-router";
import AdminRoute from "./AdminRoute";

const AdminRoutes = () => {
    let { path } = useRouteMatch();

    return (
        <>
            <AdminRoute exact path={path}>
                <Dashboard />
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

            <AdminRoute path={`${path}/song/edit/:id`}>
                <EditSong />
            </AdminRoute>

            <AdminRoute exact path={`${path}/genre`}>
                <Genre />
            </AdminRoute>
        </>
    );
};

export default AdminRoutes;
