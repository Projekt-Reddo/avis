import React, { useEffect } from "react";

import Button from "components/Button/Button";
import { useModal } from "components/Modal";
import ProfileEditModal from "components/ProfileEdit/ProfileEdit.Modal";
import ProfileEdit from "components/ProfileEdit/ProfileEdit";
import { useAppSelector } from "utils/react-redux-hooks";

interface ProfileEditButtonProps {
    disabled: boolean;
}

const ProfileEditButton: React.FC<ProfileEditButtonProps> = ({ disabled }) => {
    const { open, setOpen } = useModal();

    const authData = useAppSelector((state) => state.auth.data);

    useEffect(() => {
        if (authData.avatar && typeof authData.avatar == "string") {
            URL.revokeObjectURL(authData.avatar);
        }
    }, []);

    return (
        <>
            <Button
                variant="white"
                className="rounded-full font-bold"
                style={{
                    boxShadow: "none",
                    border: "1px solid black",
                    height: "fit-content",
                }}
                disabled={disabled}
                onClick={() => setOpen(true)}
                data-cy="edit-profile-btn"
            >
                Edit Profile
            </Button>

            <ProfileEditModal
                open={open}
                setOpen={setOpen}
                Children={ProfileEdit}
            />
        </>
    );
};

export default ProfileEditButton;
