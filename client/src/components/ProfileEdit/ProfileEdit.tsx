import { yupResolver } from "@hookform/resolvers/yup";
import Input from "components/shared/Input";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import yup from "utils/yup-config";

import WALLPAPER_BG from "static/Profile_wall.jpg";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import Button from "components/Button/Button";
import AvatarDropzone from "./AvatarDropzone";
import { updateProfileAsync } from "store/slices/profileSlice";
import { addNewToast } from "components/Toast";

interface ProfileEditProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ setOpen }) => {
    const profileState = useAppSelector((state) => state.profile);

    // Form init
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            name: profileState.data.name,
            avatarFile: null,
        },
    });

    // HandleSubmit
    const dispatch = useAppDispatch();
    const handleSubmitForm = (data: FieldValues) => {
        if (dataHasSameOldValue(data))
            return addNewToast({
                variant: "warning",
                message: "you didn't update anything :'<",
            });

        dispatch(updateProfileAsync(data as ProfileUpdateDto));
    };

    function dataHasSameOldValue(data: FieldValues) {
        if (!data.avatarFile) {
            if (data.name === profileState.data.name) return true;
        }

        return false;
    }

    return (
        <div
            className="mb-4 relative profile-wrapper"
            onSubmit={handleSubmit(handleSubmitForm)}
        >
            {/* Avatar */}
            <AvatarDropzone
                getValues={getValues}
                setValue={setValue}
                error={errors.avatarFile}
                defaultPreview={profileState.data.avatar}
                fieldName="avatarFile"
            />

            <div className="w-full h-full flex flex-col items-center">
                {/* Wallpaper */}
                <div
                    className="w-full profile-bg-img-position profile-wallpaper lg:rounded-t-lg"
                    style={{
                        backgroundImage: `url(${WALLPAPER_BG})`,
                        backgroundSize: "cover",
                    }}
                ></div>

                {/* Profile Info */}
                <div className="flex flex-row justify-center w-full p-6 pt-4">
                    {/* Profile Detail */}
                    <form className="w-4/5 profile-info-left">
                        <Input
                            className="py-3 w-full"
                            label="Name"
                            placeholder="Please enter your name"
                            register={register("name")}
                            error={errors.name}
                            data-cy="display-name"
                        />
                        <div className="w-full flex flex-row items-center justify-end mt-4">
                            <Button
                                variant="secondary"
                                className="block"
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={profileState.status == "loading"}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="block ml-4"
                                type="submit"
                                disabled={profileState.status == "loading"}
                                data-cy="profile-save-btn"
                            >
                                Edit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required!")
        .name("Please enter valid name without invalid special characters")
        .min(6, "Name must be minimum of 6 characters"),
    avatarFile: yup.mixed().nullable(true),
});

export default ProfileEdit;
