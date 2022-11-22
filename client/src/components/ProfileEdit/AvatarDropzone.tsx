import { addNewToast } from "components/Toast";
import { FunctionComponent, useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface ImageDropzoneProps {
    accept?: Accept;
    maxFile?: number;
    maxSize?: number;
    className?: string;
    defaultPreview?: string;
    fieldName?: string; // useForm field name
    getValues: any; // useForm object
    setValue: any; // useForm object
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const byteToMB = 1000000;
const thumbnailInputField = "thumbnailFile";

const AvatarDropzone: FunctionComponent<ImageDropzoneProps> = ({
    accept = {
        "image/*": [".png", ".jpg", ".jpeg", ".jfif", ".webp"],
    },
    maxFile = 1,
    maxSize = 15 * byteToMB, // 15MB
    defaultPreview = "",
    fieldName = thumbnailInputField,
    getValues,
    setValue,
    error,
}) => {
    const savedImage = getValues(fieldName);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: accept,
        maxFiles: maxFile,
        maxSize: maxSize,
        onDropAccepted(acceptedFiles) {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);

                setValue(fieldName, file);
            }
        },
        onDropRejected() {
            addNewToast({
                variant: "danger",
                message: "Your file is too powerful!!",
            });
        },
    });

    const [preview, setPreview] = useState<string>(defaultPreview);

    useEffect(() => {
        if (savedImage && defaultPreview !== "") {
            const objectUrl = URL.createObjectURL(savedImage);
            setPreview(objectUrl);
        }
    }, []);

    return (
        <>
            <div
                {...getRootProps({
                    className: "dropzone",
                })}
            >
                <input {...getInputProps()} data-cy="avatar-input" />

                <div
                    className="profile-avatar-edit absolute rounded-full border-4 border-white profile-bg-img-position"
                    style={{
                        backgroundImage: `url(${preview})`,
                        backgroundSize: "cover",
                        cursor: "pointer",
                    }}
                ></div>
            </div>

            {/* Error msg */}
            {error?.message && acceptedFiles.length == 0 && (
                <span className="text-red-600 mt-3">{`${error.message}`}</span>
            )}
        </>
    );
};

export default AvatarDropzone;
