import React from "react";
import { useAppSelector } from "utils/react-redux-hooks";
import Toast from "./Toast";
import "./toast.css";

const ToastManager = () => {
    const toastsList = useAppSelector((state) => state.toast);

    return (
        <div
            style={{
                zIndex: 69,
                position: "fixed",
                pointerEvents: "none",
                bottom: 20,
                right: 20,
            }}
        >
            {toastsList.map((item) => (
                <Toast item={item} key={item.id} />
            ))}
        </div>
    );
};

export default ToastManager;
