import { Capacitor } from "@capacitor/core";
import Icon from "components/shared/Icon";

import {
    loginWithGoogleAltAsync,
    loginWithGoogleAsync,
} from "store/slices/authSlice";
import { PLATFORM } from "utils/constants";
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
                if (
                    !Capacitor.getPlatform() ||
                    Capacitor.getPlatform() === PLATFORM.WEB
                ) {
                    dispatch(loginWithGoogleAsync());
                } else {
                    dispatch(loginWithGoogleAltAsync());
                }
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
