import SignUpForm from "./SignUpForm";
import AuthFooter from "./AuthFooter";
import AuthHeader from "./AuthHeader";
import LoginForm from "./LoginForm";

const createAuthContent = (pageType: "signup" | "login" = "signup") => {
    const pageRender =
        pageType === "signup"
            ? {
                  form: <SignUpForm />,
                  message: "Already have an account?",
                  url: "/login",
                  title: "Login now",
              }
            : {
                  form: <LoginForm />,
                  message: "You haven't have an account?",
                  url: "/signup",
                  title: "Sign up now",
              };

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-12 lg:p-16">
            <AuthHeader />
            <div className="w-full">{pageRender.form}</div>
            <AuthFooter {...pageRender} />
        </div>
    );
};

export default createAuthContent;
