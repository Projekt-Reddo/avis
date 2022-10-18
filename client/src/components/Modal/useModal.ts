import { useState } from "react";

interface ModalMessage {
    type?: string;
    title: string;
    message: string;
    confirmTitle?: string;
    cancelTitle?: string;
}

export const useModal = (defaultModalMessage?: ModalMessage) => {
    const [open, setOpen] = useState(false);

    const [modalMessage, setModalMessage] = useState<ModalMessage>(
        defaultModalMessage || {
            type: "info",
            title: "Your title",
            message: "This is modal message for display",
            confirmTitle: "Confirm",
            cancelTitle: "Cancel",
        }
    );

    return {
        open,
        setOpen,
        modalMessage,
        setModalMessage,
    };
};
