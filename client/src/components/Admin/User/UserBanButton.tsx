import { banManyApi } from "api/account-api";
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";
import React from "react";
import UserManageButtonLayout, {
    UserManageButtonProps,
} from "./UserManageButtonLayout";

const UserBanButton: React.FC<UserManageButtonProps> = ({
    selectedUser,
    setPageRowFilter,
}) => {
    if (selectedUser.length == 0) return <></>;
    let isBanned = selectedUser[0].isBanned;

    const hideCondition = () => {
        // Hide when users do not have the same role
        let selectedRoleList = selectedUser.filter(
            (user) => user.isBanned === isBanned
        );

        return selectedRoleList.length !== selectedUser.length;
    };

    const handleConfirm = (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setLoading(true);
        banManyApi({
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
                        <span>{isBanned ? "Unban" : "Ban"} User(s)</span>
                    </>
                ),
                props: {
                    variant: "danger",
                },
            }}
            modal={{
                message: (
                    <>
                        {isBanned === false ? (
                            <span>
                                Do you really want to <b>ban</b> these users?
                            </span>
                        ) : (
                            <span>
                                Do you really want to <b>unban</b> these users?
                            </span>
                        )}
                    </>
                ),
                confirmButton: {
                    title: isBanned ? "Unban" : "Ban",
                    props: {
                        variant: "danger",
                    },
                },
            }}
            onConfirmed={handleConfirm}
        />
    );
};

export default UserBanButton;
