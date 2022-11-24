import { banManyApi, muteManyApi } from "api/account-api";
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";
import React from "react";
import {
    UserManageButtonProps,
} from "./UserManageButtonLayout";
import UserMuteButtonLayout from "./UserMuteButtonLayout";

const UserMuteButton: React.FC<UserManageButtonProps> = ({
    selectedUser,
    setPageRowFilter,
}) => {

        const mute : MuteOption = {
            mutePostDays: null,
            muteCommentDays: null
        }

        if (selectedUser.length == 0) return <></>;

        let selectedRole = selectedUser[0].role;

        const hideCondition = () => {
            // Hide when users do not have the same role
            // let selectedRoleList = selectedUser.filter(
            //     (user) => user.role === selectedRole
            // );

            return false;
        };

        const handleConfirm = (
            setLoading: React.Dispatch<React.SetStateAction<boolean>>
        ) => {
            setLoading(true);
            muteManyApi({
                uids: selectedUser.map((user) => user.id),
                mutePostDays: mute.mutePostDays,
                muteCommentDays: mute.muteCommentDays
            })
                .then((res) => {
                    if (res.status === 200) {
                        addNewToast({
                            variant: "primary",
                            message: res.message,
                        });
                    } else {
                        addNewToast({
                            variant: "warning",
                            message: res.message,
                        });
                    }
                    setPageRowFilter((previosState) => ({
                        ...previosState,
                    }));
                    setLoading(false);
                })
                .catch((err) => {
                    addNewToast({
                        variant: "warning",
                        message:
                            err.response?.data?.message || "Some error occured!",
                    });
                    setLoading(false);
                });
        };

        return(
            <div className="ml-3">
                <UserMuteButtonLayout
                    selectedUser={selectedUser}
                    hideCondition={hideCondition()}
                    button={{
                        title: (
                            <>
                                <Icon icon="user" className="mr-3" />
                                <span>Mute User(s)</span>
                            </>
                        ),
                        props: {
                            variant: "danger",
                        },
                    }}
                    modal={{
                        message: (
                            <>
                                Mute
                            </>
                        ),
                        confirmButton: {
                            title: "Mute",
                            props: {
                                variant: "danger",
                            },
                        },
                    }}
                    onConfirmed={handleConfirm}
                    mute = {mute}
                    />
            </div>
        );
};

export default UserMuteButton;