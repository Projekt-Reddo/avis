import Icon from "components/shared/Icon";
import { FunctionComponent, useEffect, useState } from "react";
import ReactPlayer from "react-player";

interface MediaDisplayProps {
    file: File | null;
    handleRemoveFile: (id?: string) => void;
}

const fileType = {
    IMAGE: "image",
    AUDIO: "audio",
    VIDEO: "video",
};

const MediaDisplay: FunctionComponent<MediaDisplayProps> = ({
    file,
    handleRemoveFile,
}) => {
    const [mediaType, setMediaType] = useState("");
    const [url, setUrl] = useState("");

    const handleRemoveSelectedFile = () => {
        setMediaType("");
        handleRemoveFile();
    };

    useEffect(() => {
        if (file) {
            setUrl(URL.createObjectURL(file));

            if (file.type.startsWith(fileType.IMAGE)) {
                setMediaType(fileType.IMAGE);
                return URL.revokeObjectURL(url);
            }

            if (file.type.startsWith(fileType.AUDIO)) {
                setMediaType(fileType.AUDIO);
                return URL.revokeObjectURL(url);
            }

            if (file.type.startsWith(fileType.VIDEO)) {
                setMediaType(fileType.VIDEO);
                return URL.revokeObjectURL(url);
            }
        } else {
            setMediaType("");
        }
    }, [file]);

    if (mediaType === fileType.IMAGE) {
        return (
            <div className="relative">
                <img
                    src={url}
                    className="rounded-md h-auto max-w-full w-full"
                />
                <div
                    className="absolute flex justify-center items-center cursor-pointer bg-[color:var(--red-general-color)] rounded-full text-white w-6 h-6 top-1 right-1"
                    onClick={() => {
                        handleRemoveSelectedFile();
                    }}
                >
                    <Icon icon="times" />
                </div>
            </div>
        );
    }

    if (mediaType === fileType.AUDIO) {
        return (
            <div className="flex flex-roww items-center gap-2 mr-2">
                <ReactPlayer
                    url={url}
                    controls={true}
                    width="100%"
                    height={50}
                />
                <div
                    className="flex justify-center items-center cursor-pointer bg-[color:var(--red-general-color)] rounded-full text-white w-6 h-6"
                    onClick={() => {
                        handleRemoveSelectedFile();
                    }}
                >
                    <Icon icon="times" />
                </div>
            </div>
        );
    }

    if (mediaType === fileType.VIDEO) {
        return (
            <div className="relative">
                <div
                    className="absolute z-50 flex justify-center items-center cursor-pointer bg-[color:var(--red-general-color)] rounded-full text-white w-6 h-6 top-1 right-1"
                    onClick={() => {
                        handleRemoveSelectedFile();
                    }}
                >
                    <Icon icon="times" />
                </div>
                <ReactPlayer
                    url={url}
                    controls={true}
                    width="100%"
                    height="100%"
                />
            </div>
        );
    }

    return <></>;
};

export default MediaDisplay;
