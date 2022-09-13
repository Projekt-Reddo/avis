import store from "store";
import { addToast } from "store/slices/toastSlice";

export const addNewToast = (toastCreate: ToastCreateType | string) => {
    if (typeof toastCreate === "string") {
        return store.dispatch(
            addToast({
                message: toastCreate,
                variant: "primary",
            })
        );
    }

    return store.dispatch(
        addToast({
            ...toastCreate,
            variant: toastCreate.variant || "primary",
        })
    );
};
