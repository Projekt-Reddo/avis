import Icon from "components/shared/Icon";
import { loginWithGoogleAsync } from "store/slices/userSlice";
import { useAppDispatch } from "utils/react-redux-hooks";

interface GoogleLoginButtonProps {}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = () => {
    const dispatch = useAppDispatch();

    return (
        <button
            className="btn-shadow rounded-full p-2"
            style={{
                height: "2.5rem",
                width: "2.5rem",
            }}
            onClick={() => {
                dispatch(loginWithGoogleAsync());
            }}
        >
            <Icon
                icon={["fab", "google"]}
                style={{
                    color: "#14b8a6",
                }}
            />
        </button>
    );
};

export default GoogleLoginButton;
