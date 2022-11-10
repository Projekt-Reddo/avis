import Dashboard from "pages/admin/Dashboard";

import { useRouteMatch } from "react-router";
import ModeratorRoute from "./ModeratorRoute";

const ModeratorRoutes = () => {
    let { path } = useRouteMatch();

    return (
        <>
            <ModeratorRoute exact path={path}>
                <Dashboard />
            </ModeratorRoute>
        </>
    );
};

export default ModeratorRoutes;
