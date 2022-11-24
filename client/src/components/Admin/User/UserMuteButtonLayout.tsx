import Button, { ButtonProps } from "components/Button/Button";
import { useModal } from "components/Modal";
import ModalForm from "components/Modal/ModalForm";
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DAY_FORMAT } from "utils/constants";

interface UserMuteButtonLayoutProps extends UserManageButtonLayoutDefaultProps {
    hideCondition?: boolean;
    button: {
        title: React.ReactNode;
        props?: ButtonProps;
    };
    modal: {
        title?: string;
        message: React.ReactNode;
        confirmButton: {
            title: React.ReactNode;
            props?: ButtonProps;
        };
    };
    onConfirmed: (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => void;
    mute: MuteOption;
}

const UserMuteButtonLayout: React.FC<UserMuteButtonLayoutProps> = ({
    selectedUser,
    hideCondition = false,
    button,
    modal,
    onConfirmed,
    mute,
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isSubmitting, isSubmitted, submitCount, isValid, isValidating },
      } = useForm();

    const [post,setPost] = React.useState();

    const [comment,setComment] = React.useState();

    const handlePostChange = (e: any) => {
        setPost(e.target.value);
        mute.mutePostDays = e.target.value;
    };

    const handleCommentChange = (e: any) => {
        setComment(e.target.value);
        mute.muteCommentDays = e.target.value;
    };

    const { open, setOpen } = useModal();

    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = () => console.log(post);

    if (hideCondition) return <></>;

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                {...button.props}
                className={`flex items-center justify-center mt-3 px-4 ${
                    button.props?.className || ""
                }`}
                data-cy="user-mute-button"
            >
                {button.title}
            </Button>

            <ModalForm
                open={open}
                setOpen={() => {}}
                title={modal.title || "Warning!"}
                modalBody={
                    <div className="w-full px-6 flex flex-col">
                        <div className="w-full">{modal.message}</div>
                        <div className="w-full flex flex-col max-h-[20rem] my-3 py-3 overflow-y-scroll">
                            {selectedUser.map((item) => (
                                <ModalUserPromoteItem
                                    item={item}
                                    key={item.id}
                                />
                            ))}
                        </div>
                        <div className="font-bold">
                            What is your Mute Options
                        </div>
                        <div >
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-row items-center justify-center mt-4">
                                <div className="rounded-lg border-2 w-[14rem] h-[5rem] ">
                                    <div className="ml-2 mt-2">
                                        Limit Posting
                                    </div>
                                    <div className="flex flex-row items-center justify-center mt-3">
                                        End in <input type="numer" value={post} onChange={handlePostChange} min={0} className=" border-2 w-[2rem] rounded-md text-black font-bold text-center bg-white ml-1 mr-1"/> Day
                                    </div>
                                </div>
                                <div className="ml-3 rounded-lg border-2 w-[14rem] h-[5rem]">
                                    <div className="ml-2 mt-2">
                                        Limit Comment
                                    </div>
                                    <div className="flex flex-row items-center justify-center mt-3">
                                        End in <input type="numer" value={comment}  onChange={handleCommentChange} min={0} className="border-2 w-[2rem] rounded-md text-black font-bold text-center bg-white ml-1 mr-1"/> Day
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="w-full flex flex-row items-center justify-end mt-5">
                            <Button
                                variant="white"
                                border={true}
                                onClick={() => setOpen(false)}
                                disabled={loading}
                                data-cy="mute-modal-cancel-btn"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                {...modal.confirmButton.props}
                                className={`ml-4 ${
                                    modal.confirmButton.props?.className || ""
                                }`}
                                disabled={loading}
                                onClick={() => onConfirmed(setLoading)}
                                data-cy="mute-modal-confirm-btn"
                            >
                                {modal.confirmButton.title}
                            </Button>
                        </div>
                    </div>
                }
                hasFooter={false}
            />
        </>
    );
};

export default UserMuteButtonLayout;

interface ModalUserPromoteItemProps {
    item: UserDisplay;
}

function ModalUserPromoteItem({ item }: ModalUserPromoteItemProps) {
    return (
        <div className="w-full rounded-lg border flex flex-row flex-wrap items-center px-6 py-3 mb-2">
            <div className="w-1/5">
                <div
                    style={{
                        backgroundImage: `url(${item.avatar})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "50px",
                        width: "50px",
                        borderRadius: "50%",
                        border: "2px solid white",
                        minWidth: "35px",
                    }}
                />
            </div>
            <div className="w-4/5 px-4 grid grid-cols-3 gap-2">
                <div className="col-span-1 font-bold">Name</div>
                <div className="col-span-2">{item.name}</div>
                <div className="col-span-1  font-bold">Joined Date</div>
                <div className="col-span-2">
                    {moment(item.joinedDate).format(DAY_FORMAT)}
                </div>
            </div>
        </div>
    );
}

export interface UserManageButtonProps
    extends UserManageButtonLayoutDefaultProps {
    setPageRowFilter: React.Dispatch<React.SetStateAction<PageRowFilterProps>>;
}
