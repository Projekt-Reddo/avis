import signup_image from "static/Flat_art_signup.png";
import PageWrapperAuth from "components/PageWrapper/PageWrapperAuth";
import createAuthContent from "components/Auth/create-auth-content";

import "components/Auth/SignUpForm.css";

const Signup = () => {
    return (
        <PageWrapperAuth
            leftImage={signup_image}
            rightContent={createAuthContent()}
        />
    );
};

export default Signup;
