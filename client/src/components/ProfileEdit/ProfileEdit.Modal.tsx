import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ProfileEditModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    Children: React.FC<any>;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
    open,
    setOpen,
    Children,
}) => {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative overflow-hidden lg:rounded-lg bg-white shadow-xl h-screen lg:h-auto w-full lg:max-w-2xl">
                                <Children setOpen={setOpen} />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ProfileEditModal;
