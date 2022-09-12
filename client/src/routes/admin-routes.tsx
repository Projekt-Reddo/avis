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
        </>
    );
};

export default AdminRoutes;
