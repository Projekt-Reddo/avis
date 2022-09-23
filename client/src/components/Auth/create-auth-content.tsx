import SignUpForm from "./SignUpForm";
import AuthFooter from "./AuthFooter";
import AuthHeader from "./AuthHeader";

const createAuthContent = (pageType: "signup" | "login" = "signup") => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-12 lg:p-16">
            <AuthHeader />
            <div className="w-full">
                <SignUpForm />
            </div>
            <AuthFooter pageType={pageType} />
        </div>
    );
};

export default createAuthContent;
