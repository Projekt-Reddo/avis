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

const ImageDropzone: FunctionComponent<ImageDropzoneProps> = ({
    accept = {
        "image/*": [".png", ".jpg", ".jpeg", ".jfif", ".webp"],
    },
    maxFile = 1,
    maxSize = 15 * byteToMB, // 15MB
    className,
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
    });

    const [preview, setPreview] = useState<string>(defaultPreview);

    useEffect(() => {
        if (savedImage && defaultPreview !== "") {
            const objectUrl = URL.createObjectURL(savedImage);
            setPreview(objectUrl);
        }
    }, []);

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            setValue(fieldName, file);
        }
    }, [acceptedFiles]);

    useEffect(() => {
        if (!getValues(fieldName)) {
            setPreview("");
        }
    }, [getValues(fieldName)]);

    const displayAccept = (item: Accept) => {
        var result: string[] = [];
        for (var key in item) {
            if (item.hasOwnProperty(key)) {
                result = result.concat(item[key]);
            }
        }
        return result.join(", ");
    };

    return (
        <section
            className={`flex flex-col items-center justify-center w-full ${className}`}
        >
            <div
                {...getRootProps({
                    className:
                        "dropzone flex justify-center w-full h-full transition bg-[color:var(--element-bg-color-elevate-1)] border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none",
                })}
            >
                <input {...getInputProps()} />
                {getValues(fieldName) || preview ? (
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url(${preview})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* <img src={preview} className="rounded-md" /> */}
                    </div>
                ) : (
                    <span className="flex flex-col items-center justify-center mx-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-[color:var(--text-secondary-color)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <span className="font-medium text-[color:var(--text-secondary-color)]">
                            Drop files to attach, or{" "}
                            <span className="text-blue-600 underline">
                                browse
                            </span>
                        </span>
                        <div className="text-sm text-[color:var(--text-secondary-color)]">
                            Accept: {displayAccept(accept)}
                        </div>
                    </span>
                )}
            </div>

            {/* Error msg */}
            {error?.message && acceptedFiles.length == 0 && (
                <span className="text-[color:var(--red-general-color)] mt-3">{`${error.message}`}</span>
            )}
        </section>
    );
};

export default ImageDropzone;
