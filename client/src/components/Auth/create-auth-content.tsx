import SignUpForm from "./SignUpForm";
import AuthFooter from "./AuthFooter";
import AuthHeader from "./AuthHeader";

const createAuthContent = (pageType: "signup" | "login" = "signup") => {
    const footerData =
        pageType === "signup"
            ? {
                  message: "Already have an account?",
                  url: "/login",
                  title: "Login now",
              }
            : {
                  message: "You haven't have an account?",
                  url: "/signup",
                  title: "Sign up now",
              };

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-12 lg:p-16">
            <AuthHeader />
            <div className="w-full">
                <SignUpForm />
            </div>
            <AuthFooter {...footerData} />
        </div>
    );
};

export default createAuthContent;
