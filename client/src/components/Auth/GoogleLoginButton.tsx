import Icon from "components/shared/Icon";

import { loginWithGoogleAsync } from "store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

interface GoogleLoginButtonProps {}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = () => {
    const dispatch = useAppDispatch();
    const authStatus = useAppSelector((state) => state.auth.status);

    const disabled = authStatus === "loading" || authStatus === "init";

    return (
        <button
            className="btn-shadow rounded-full p-2 bg-[color:var(--element-bg-color)]"
            style={{
                height: "2.5rem",
                width: "2.5rem",
                opacity: disabled ? "0.5" : "1",
            }}
            onClick={() => {
                dispatch(loginWithGoogleAsync());
            }}
            disabled={disabled}
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
