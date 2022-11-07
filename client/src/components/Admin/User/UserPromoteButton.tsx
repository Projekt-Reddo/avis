import { promoteManyApi } from "api/account-api";
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";
import React from "react";
import { USER_ROLE } from "utils/constants";
import UserManageButtonLayout, {
    UserManageButtonProps,
} from "./UserManageButtonLayout";

const UserPromoteButton: React.FC<UserManageButtonProps> = ({
    selectedUser,
    setPageRowFilter,
}) => {
    if (selectedUser.length == 0) return <></>;
    let selectedRole = selectedUser[0].role;

    const hideCondition = () => {
        // Hide when users do not have the same role
        let selectedRoleList = selectedUser.filter(
            (user) => user.role === selectedRole
        );

        return selectedRoleList.length !== selectedUser.length;
    };

    const handleConfirm = (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setLoading(true);
        promoteManyApi({
            uids: selectedUser.map((user) => user.id),
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

    return (
        <UserManageButtonLayout
            selectedUser={selectedUser}
            hideCondition={hideCondition()}
            button={{
                title: (
                    <>
                        <Icon icon="user" className="mr-3" />
                        <span>
                            {selectedRole === USER_ROLE.USER
                                ? "Promote"
                                : "Demote"}{" "}
                            User(s)
                        </span>
                    </>
                ),
                props: {
                    className: "mr-3",
                },
            }}
            modal={{
                message: (
                    <>
                        {selectedRole === USER_ROLE.USER ? (
                            <span>
                                Do you really want to promote these users from{" "}
                                <b>{selectedRole}</b> to{" "}
                                <b>{USER_ROLE.MODERATOR}</b>?
                            </span>
                        ) : (
                            <span>
                                Do you really want to demote these users from{" "}
                                <b>{selectedRole}</b> to <b>{USER_ROLE.USER}</b>
                                ?
                            </span>
                        )}
                    </>
                ),
                confirmButton: {
                    title:
                        selectedRole === USER_ROLE.USER ? "Promote" : "Demote",
                },
            }}
            onConfirmed={handleConfirm}
        />
    );
};

export default UserPromoteButton;
