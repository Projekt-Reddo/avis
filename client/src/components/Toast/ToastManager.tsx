import React from "react";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useAppSelector } from "utils/react-redux-hooks";
import { useWindowDimensions } from "utils/useWindowDimensions";
import Toast from "./Toast";
import "./toast.css";

const ToastManager = () => {
    const toastsList = useAppSelector((state) => state.toast);

    const { width } = useWindowDimensions();

    return (
        <div
            style={
                width! < MOBILE_BREAKPOINT
                    ? {
                          zIndex: 69,
                          position: "fixed",
                          pointerEvents: "none",
                          top: 20,
                          left: 0,
                          right: 0,
                      }
                    : {
                          zIndex: 69,
                          position: "fixed",
                          pointerEvents: "none",
                          bottom: 20,
                          right: 20,
                      }
            }
        >
            {toastsList.map((item) => (
                <Toast item={item} key={item.id} />
            ))}
        </div>
    );
};

export default ToastManager;
