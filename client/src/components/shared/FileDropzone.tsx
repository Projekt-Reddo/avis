import { FunctionComponent, useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import Icon from "./Icon";

interface FileDropzoneProps {
    accept?: Accept;
    maxFile?: number;
    maxSize?: number;
    getValues: any; // useForm object
    setValue: any; // useForm object
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const byteToMB = 1000000;
const fileInputField = "file";

const FileDropzone: FunctionComponent<FileDropzoneProps> = ({
    accept = {
        "audio/mpeg": [".mp3"],
    },
    maxFile = 1,
    maxSize = 5 * byteToMB, // 5MB
    getValues,
    setValue,
    error,
}) => {
    var savedFile: File = getValues(fileInputField);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: accept,
        maxFiles: maxFile,
        maxSize: maxSize,
    });

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            setValue(fileInputField, acceptedFiles[0]);
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
        <section className="flex flex-col items-center w-full">
            <div
                {...getRootProps({
                    className:
                        "dropzone flex justify-center w-full h-40 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none",
                })}
            >
                <input {...getInputProps()} />
                <span className="flex flex-col items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-600"
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
                    <span className="font-medium text-gray-600">
                        Drop files to attach, or{" "}
                        <span className="text-blue-600 underline">browse</span>
                    </span>
                    <div className="text-sm text-gray-600">
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
                <span className="text-red-600 mt-3">{`${error.message}`}</span>
            )}
        </section>
    );
};

export default FileDropzone;