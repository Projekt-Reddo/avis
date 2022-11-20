import Dashboard from "pages/admin/Dashboard";
import ViewUser from "pages/admin/User/View";
import Report from "pages/admin/Report/View";
import ReportDetail from "pages/admin/Report/Detail";

import { useRouteMatch } from "react-router";
import ModeratorRoute from "./ModeratorRoute";

const ModeratorRoutes = () => {
    let { path } = useRouteMatch();

    return (
        <>
            <ModeratorRoute exact path={path}>
                <Dashboard />
            </ModeratorRoute>

            <ModeratorRoute exact path={`${path}/user`}>
                <ViewUser />
            </ModeratorRoute>

            <ModeratorRoute exact path={`${path}/report`}>
                <Report />
            </ModeratorRoute>

            <ModeratorRoute exact path={`${path}/report/:id`}>
                <ReportDetail />
            </ModeratorRoute>
        </>
    );
};

export default ModeratorRoutes;
