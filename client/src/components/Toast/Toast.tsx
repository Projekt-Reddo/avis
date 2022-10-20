import Icon from "components/shared/Icon";
import React, { useEffect } from "react";
import { removeToast } from "store/slices/toastSlice";
import { useAppDispatch } from "utils/react-redux-hooks";

interface ToastProps {
    item: ToastType;
}

const Toast: React.FC<ToastProps> = ({ item }) => {
    const dispatch = useAppDispatch();

    const handleRemoveToast = () => {
        dispatch(
            removeToast({
                id: item.id,
            })
        );
    };

    // Auto clear after having mounted 6000 ms
    useEffect(() => {
        const timer = setTimeout(handleRemoveToast, 7000);

        // Clean up
        return () => {
            clearTimeout(timer);
        };
    }, []);

    const style = toastVariants[item.variant];

    return (
        <div
            style={{
                pointerEvents: "all",
            }}
            className="shadow-app bg-white rounded-lg w-[20rem] lg:w-[24rem] min-h-[5rem] flex flex-row flex-wrap items-center relative my-3 mx-auto"
            onClick={handleRemoveToast}
        >
            <div
                className="rounded-l-lg h-full flex flex-row items-center justify-center absolute left-0"
                style={{
                    width: "5rem",
                    backgroundColor: style.backgroundColor,
                }}
            >
                <div
                    className="bg-white rounded-full flex flex-row items-center justify-center"
                    style={{
                        width: "3rem",
                        height: "3rem",
                    }}
                >
                    <Icon
                        icon={style.icon}
                        size="lg"
                        color={style.backgroundColor}
                    />
                </div>
            </div>
            <div
                className="p-2.5 h-fit"
                style={{
                    marginLeft: "5rem",
                }}
            >
                {item.message}
            </div>
        </div>
    );
};

export default Toast;

const toastVariants: ToastVariantsType = {
    primary: {
        backgroundColor: "var(--teal-general-color)",
        icon: "check",
    },
    danger: {
        backgroundColor: "var(--red-general-color)",
        icon: "bolt-lightning",
    },
    warning: {
        backgroundColor: "var(--amber-general-color)",
        icon: "triangle-exclamation",
    },
    info: {
        backgroundColor: "var(--blue-general-color)",
        icon: "info",
    },
};
