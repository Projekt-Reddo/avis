import Icon from "components/shared/Icon";
import { loginWithGoogleAsync } from "store/slices/userSlice";
import { useAppDispatch } from "utils/react-redux-hooks";

interface GoogleLoginButtonProps {}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = () => {
    const dispatch = useAppDispatch();

    return (
        <button
            className="mt-3 btn-shadow rounded-full p-2"
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
