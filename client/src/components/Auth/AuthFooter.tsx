import GoogleLoginButton from "components/Auth/GoogleLoginButton";
import ButtonLink from "components/Button/ButtonLink";

interface AuthFooterProps {
    message: string;
    url: string;
    title: string;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ message, url, title }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-3/4 border-t-2 mb-2.5"></div>
            <div className="w-full flex flex-row items-center justify-between">
                <div className="flex flex-col items-start">
                    <div className="mb-2">Login with</div>
                    <GoogleLoginButton />
                </div>

                <div className="flex flex-col items-end">
                    <div className="mb-2.5">{message}</div>
                    <ButtonLink variant="white" to={url}>
                        {title}
                    </ButtonLink>
                </div>
            </div>
        </div>
    );
};

export default AuthFooter;
