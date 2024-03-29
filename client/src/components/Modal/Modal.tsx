import * as React from "react";
import ReactDOM from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import Icon from "../shared/Icon";

interface ModalProps {
    type: "info" | "error" | "warning";
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    message: string;
    modalBody?: any;
    onConfirm: () => void;
    confirmTitle?: string;
    onCancel?: () => void;
    cancelTitle?: string;
}

const Modal: React.FC<ModalProps> = ({
    type = "info",
    open = false,
    setOpen,
    title,
    message,
    modalBody,
    onConfirm = () => {},
    confirmTitle = "Accept",
    onCancel = () => {},
    cancelTitle = "Cancel",
}) => {
    const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

    var style = styleOptions[type];

    return ReactDOM.createPortal(
        <Transition.Root show={open} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed z-50 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                }}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-70 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-[color:var(--element-bg-color)] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-[color:var(--border-color)]">
                            <div className="bg-[color:var(--element-bg-color)] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 font-bold text-[color:var(--text-secondary-color)]"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <div
                                        className={`flex my-4 rounded-md gap-2`}
                                    >
                                        <div className={`text-base`}>
                                            {message}
                                        </div>
                                    </div>
                                    <div className="mt-2">{modalBody}</div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${style.btnColor} text-base font-medium text-white ${style.btnHover} focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onConfirm();
                                        setOpen(false);
                                    }}
                                    data-cy="modal-confirm-btn"
                                >
                                    {confirmTitle}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCancel();
                                        setOpen(false);
                                    }}
                                    ref={cancelButtonRef}
                                >
                                    {cancelTitle}
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>,
        document.body
    );
};

export default Modal;

const styleOptions = {
    info: {
        icon: (
            <Icon
                icon="circle-info"
                className={`h-6 w-6 text-[color:var(--blue-general-color)]`}
            />
        ),
        textColor: "text-[color:var(--blue-general-color)]",
        iconCover: "bg-cyan-100",
        btnColor: "bg-[color:var(--blue-general-color)]",
        btnHover: "hover:bg-[color:var(--blue-darker-color)]",
    },
    error: {
        icon: (
            <Icon
                icon="exclamation-circle"
                className={`h-6 w-6 text-[color:var(--red-general-color)]`}
            />
        ),
        textColor: "text-[color:var(--red-general-color)]",
        iconCover: "bg-red-100",
        btnColor: "bg-[color:var(--red-general-color)]",
        btnHover: "hover:bg-[var(--red-darker-color)]",
    },
    warning: {
        icon: (
            <Icon
                icon="triangle-exclamation"
                className={`h-6 w-6 text-[color:var(--amber-general-color)]`}
            />
        ),
        textColor: "text-[color:var(--amber-general-color)]",
        iconCover: "bg-amber-100",
        btnColor: "bg-[color:var(--amber-general-color)]",
        btnHover: "hover:bg-[var(--amber-darker-color)]",
    },
};
