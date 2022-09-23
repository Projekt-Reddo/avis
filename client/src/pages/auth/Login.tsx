import PageWrapperAuth from "components/PageWrapper/PageWrapperAuth";

import login_flat_art from "static/Flat_art_login.jpg";
import createAuthContent from "components/Auth/create-auth-content";

const Login = () => {
    return (
        <PageWrapperAuth
            leftImage={login_flat_art}
            rightContent={createAuthContent()}
        />
    );
};

export default Login;
