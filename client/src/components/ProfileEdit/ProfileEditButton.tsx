import React from "react";

import Button from "components/Button/Button";
import { useModal } from "components/Modal";
import ProfileEditModal from "components/ProfileEdit/ProfileEdit.Modal";
import ProfileEdit from "components/ProfileEdit/ProfileEdit";

interface ProfileEditButtonProps {
    disabled: boolean;
}

const ProfileEditButton: React.FC<ProfileEditButtonProps> = ({ disabled }) => {
    const { open, setOpen } = useModal();

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
