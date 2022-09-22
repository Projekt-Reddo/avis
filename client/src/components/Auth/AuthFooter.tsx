import Button from "components/Button/Button";
import GoogleLoginButton from "components/Auth/GoogleLoginButton";

interface AuthFooterProps {
    pageType: string;
}

const AuthFooter: React.FC<AuthFooterProps> = () => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-3/4 border-t-2 mb-2.5"></div>
            <div className="w-full flex flex-row items-center justify-between">
                <div className="flex flex-col items-start">
                    <div className="mb-2">Login with</div>
                    <GoogleLoginButton />
                </div>

                <div className="flex flex-col items-end">
                    <div className="mb-2.5">Already have account?</div>
                    <Button variant="white">Login</Button>
                </div>
            </div>
        </div>
    );
};

export default AuthFooter;
