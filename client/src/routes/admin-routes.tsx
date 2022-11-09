import ViewSong from "pages/admin/Song/View";
import ViewUser from "pages/admin/User/View";
import CreateSong from "pages/admin/Song/Create";
import EditSong from "pages/admin/Song/Edit";
import Dashboard from "pages/admin/Dashboard";
import Genre from "pages/admin/Genre";
import Report from "pages/admin/Report/View";
import ReportDetail from "pages/admin/Report/Detail";

import { useRouteMatch } from "react-router";
import AdminRoute from "./AdminRoute";
import ViewArtist from "pages/admin/Artist/View";
import CreateArtist from "pages/admin/Artist/Create";

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

            <AdminRoute exact path={`${path}/artist`}>
                <ViewArtist />
            </AdminRoute>

            <AdminRoute exact path={`${path}/artist/create`}>
                <CreateArtist />
            </AdminRoute>

            <AdminRoute exact path={`${path}/report`}>
                <Report />
            </AdminRoute>

            <AdminRoute exact path={`${path}/report/:id`}>
                <ReportDetail />
            </AdminRoute>
        </>
    );
};

export default AdminRoutes;
