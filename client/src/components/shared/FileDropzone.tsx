import { FunctionComponent, useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import Icon from "./Icon";

interface FileDropzoneProps {
    id?: string;
    accept?: Accept;
    maxFile?: number;
    maxSize?: number;
    fileInputField?: string;
    getValues: any; // useForm object
    setValue: any; // useForm object
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    hidden?: boolean;
}

const byteToMB = 1000000;
const defaultInputField = "file";

const FileDropzone: FunctionComponent<FileDropzoneProps> = ({
    id,
    accept = {
        "audio/mpeg": [".mp3"],
    },
    maxFile = 1,
    maxSize = 75 * byteToMB, // 75MB
    fileInputField = defaultInputField,
    getValues,
    setValue,
    error,
    hidden = false,
}) => {
    var savedFile: File = getValues(fileInputField);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: accept,
        maxFiles: maxFile,
        maxSize: maxSize,
    });

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            if (maxFile === 1) {
                setValue(fileInputField, acceptedFiles[0]);
            } else {
                setValue(fileInputField, acceptedFiles);
            }
        }
    }, [acceptedFiles]);

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
            className={`flex flex-col items-center w-full ${
                hidden ? "hidden" : "block"
            }`}
        >
            <div
                {...getRootProps({
                    className:
                        "dropzone flex justify-center w-full h-40 px-4 transition bg-[color:var(--element-bg-color-elevate-1)] border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none",
                })}
            >
                <input id={id ? id : ""} {...getInputProps()} hidden={hidden} />
                <span className="flex flex-col items-center justify-center">
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
                        <span className="text-blue-600 underline">browse</span>
                    </span>
                    <div className="text-sm text-[color:var(--text-secondary-color)]">
                        Accept: {displayAccept(accept)}
                    </div>
                </span>
            </div>

            {/* File name - Size */}
            {acceptedFiles && acceptedFiles.length > 0 ? (
                <>
                    <div className="flex flex-row items-center mt-3">
                        <Icon icon={["fas", "file"]} size="lg" />{" "}
                        <span key={acceptedFiles[0].name}>
                            {acceptedFiles[0].name} -{" "}
                            {acceptedFiles[0].size / byteToMB} MB
                        </span>
                    </div>
                </>
            ) : savedFile ? (
                <div className="flex flex-row items-center mt-3">
                    <Icon icon={["fas", "file"]} size="lg" />{" "}
                    <span key={savedFile.name}>
                        {savedFile.name} - {savedFile.size / byteToMB} MB
                    </span>
                </div>
            ) : (
                <></>
            )}

            {/* Error msg */}
            {error?.message && acceptedFiles.length == 0 && (
                <span className="text-[color:var(--red-general-color)] mt-3">{`${error.message}`}</span>
            )}
        </section>
    );
};

export default FileDropzone;
