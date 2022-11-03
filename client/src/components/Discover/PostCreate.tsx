// Libs
import React from "react";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { createPostAsync } from "store/slices/postSlice";
import ReactPlayer from "react-player";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import { useOutsideClick } from "utils/useOutsideClick";

// Components
import Icon from "components/shared/Icon";
import Button from "components/Button/Button";
import { addNewToast } from "components/Toast";

// Style
import "theme/Discover.css";
import "react-datepicker/dist/react-datepicker.css";

interface PostCreateProps {
    loading: boolean;
}

interface DisplayStatusProps {
    value: string;
    label: string;
}

interface ImageUploadProps {
    id: string;
    file: File;
}

const fileType = {
    IMAGE: "image",
    AUDIO: "audio",
    VIDEO: "video",
};

const options = [
    { value: "public", label: "Public: Everyone can see this Post" },
    { value: "private", label: "Private: Only you can see this Post" },
];

const MAXFILES = 10;
const MAXSIZE = 15;

const PostCreate: React.FC<PostCreateProps> = ({ loading }) => {
    const dispatch = useAppDispatch();

    const authState = useAppSelector((state) => state.auth.data);

    const inputRef = React.useRef<any>(null);
    const [content, setContent] = React.useState<string>("");

    const [uploadedImages, setUploadedImages] = React.useState<
        ImageUploadProps[]
    >([]);
    const [uploadedAudio, setUploadedAudio] = React.useState<any>(null);
    const [uploadedVideo, setUploadedVideo] = React.useState<any>(null);
    const [typeUpload, setTypeUpload] = React.useState("");

    const [showPicker, setShowPicker] = React.useState<boolean>(false);
    const pickerRef = React.useRef(null);
    useOutsideClick(pickerRef, () => {
        setShowPicker(false);
    });

    const [isOpenCalendar, setIsOpenCalendar] = React.useState<boolean>(false);
    const [publishedAt, setPublishedAt] = React.useState<Date | null>(null);
    const calendarRef = React.useRef(null);
    useOutsideClick(calendarRef, () => {
        setIsOpenCalendar(false);
    });

    const [displayStatus, setDisplayStatus] =
        React.useState<DisplayStatusProps>({
            value: "public",
            label: "Public: Everyone can see this Post",
        });
    const [isOpenSelect, setIsOpenSelect] = React.useState(false);

    const handleCreatePost = (event: React.FormEvent) => {
        event.preventDefault();

        setContent("");
        setShowPicker(false);
        setUploadedImages([]);
        setUploadedAudio(null);
        setUploadedVideo(null);
        setTypeUpload("");
        setPublishedAt(null);

        dispatch(
            createPostAsync({
                content: content,
                medias:
                    typeUpload === ""
                        ? []
                        : typeUpload === fileType.IMAGE
                        ? uploadedImages.map((img) => img.file)
                        : typeUpload === fileType.AUDIO
                        ? [uploadedAudio]
                        : [uploadedVideo],
                hashtags: content
                    .replaceAll("\n", " ")
                    .split(" ")
                    .map((word) =>
                        word.includes("#") ? word.split("#")[1] : " "
                    )
                    .filter((word) => word != " "),
                publishedAt:
                    publishedAt === null ? "" : publishedAt.toLocaleString(),
                displayStatus:
                    publishedAt !== null ? "private" : displayStatus.value,
            })
        );
    };

    const handleUploadFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            addNewToast({
                variant: "warning",
                message:
                    "Files input invalid. Please select only Images, an Audio or a Video file!!!",
            });
            return;
        }

        if (checkFileSize(event.target.files)) {
            addNewToast({
                variant: "warning",
                message:
                    "Each uploaded file must be equal or less than 15 MB!!!",
            });
            return;
        }

        if (checkImageType(event.target.files)) {
            if (event.target.files.length + uploadedImages.length > MAXFILES) {
                addNewToast({
                    variant: "warning",
                    message: "Maximum uploaded image is 10!!!",
                });
                return;
            }

            setTypeUpload(fileType.IMAGE);
            setUploadedAudio(null);
            setUploadedVideo(null);

            for (const file of event.target.files) {
                // Generate unique Id
                const uniqueId = uuidv4();

                setUploadedImages((imgs: any) => [
                    ...imgs,
                    { id: uniqueId, file: file },
                ]);
            }

            return;
        }

        if (checkAudioType(event.target.files)) {
            setTypeUpload(fileType.AUDIO);
            setUploadedImages([]);
            setUploadedVideo(null);

            setUploadedAudio(event.target.files[0]);
            return;
        }

        if (checkVideoType(event.target.files)) {
            setTypeUpload(fileType.VIDEO);
            setUploadedImages([]);
            setUploadedAudio(null);

            setUploadedVideo(event.target.files[0]);
            return;
        }

        addNewToast({
            variant: "warning",
            message:
                "Files input invalid. Please select only Images, an Audio or a Video file!!!",
        });

        return;
    };

    const checkFileSize = (files: FileList) => {
        for (const file of files) {
            if (file.size / 1024 / 1024 > MAXSIZE) {
                return true;
            }
        }
        return false;
    };

    const checkImageType = (files: FileList) => {
        for (const file of files) {
            if (!file.type.startsWith("image")) {
                return false;
            }
        }
        return true;
    };

    const checkAudioType = (files: FileList) => {
        for (const file of files) {
            if (!file.type.startsWith("audio")) {
                return false;
            }
        }
        return true;
    };

    const checkVideoType = (files: FileList) => {
        for (const file of files) {
            if (!file.type.startsWith("video")) {
                return false;
            }
        }

        return true;
    };

    const handleRemoveImageFile = (id: string) => {
        setUploadedImages(
            uploadedImages.filter(
                (imageUpload: ImageUploadProps) => imageUpload.id !== id
            )
        );
    };

    const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
        const cursor = inputRef.current.selectionStart;

        const text =
            content.slice(0, cursor) + emojiData.emoji + content.slice(cursor);
        setContent(text);

        //Codes added for the new cursor
        const newCursor = cursor + emojiData.emoji.length;
        setTimeout(
            () => inputRef.current.setSelectionRange(newCursor, newCursor),
            10
        );
    };

    const handleSelectPublishedAt = (date: Date) => {
        if (date < new Date()) {
            addNewToast({
                variant: "warning",
                message: "Select time in the future please!!!",
            });
            return;
        }
        setPublishedAt(date);
    };

    if (!authState) {
        return <></>;
    }

    const HASHTAG_FORMATTER = (string: string) => {
        return string
            .split(/((?:^|\s)(?:#[a-z\d-] || @[a-z\d-]+))/gi)
            .filter(Boolean)
            .map((v, i) => {
                if (v.includes("#")) {
                    return (
                        <Link
                            key={i}
                            to={{
                                pathname: "/search/discover",
                                state: {
                                    hashtags: [v.split("#")[1]],
                                },
                            }}
                            onClick={(event: React.MouseEvent<HTMLElement>) =>
                                event.stopPropagation()
                            }
                            style={{ color: "var(--teal-general-color)" }}
                        >
                            {v}
                        </Link>
                    );
                } else {
                    return v;
                }
            });
    };

    return (
        <div className="lg:pt-4">
            <form
                className="card grid grid-cols-5 sm:grid-cols-10 gap-4 min-w-[20rem] p-4"
                onSubmit={handleCreatePost}
            >
                {/* Avatar */}
                <div className="col-span-1 flex justify-center ">
                    <div
                        className="avatar"
                        style={{
                            backgroundImage: `url(${authState?.avatar})`,
                        }}
                    />
                    <div />
                </div>

                <div className="col-span-4 sm:col-span-9">
                    {publishedAt && (
                        <div className="flex items-center">
                            <div className="text-[color:var(--text-secondary-color)] mb-2 text-xs sm:text-base">
                                Will publish at {publishedAt.toLocaleString()}
                            </div>
                            <div
                                className="cancel-circle flex justify-center items-center cursor-pointer w-[1rem] h-[1rem] text-[0.75rem] mb-2 ml-2"
                                onClick={() => setPublishedAt(null)}
                            >
                                <Icon icon="times" />
                            </div>
                        </div>
                    )}

                    {/* Select Display Status */}
                    {isOpenSelect && !publishedAt ? (
                        <Select
                            options={options}
                            defaultValue={displayStatus}
                            onChange={(val: any) => setDisplayStatus(val)}
                            styles={customStyles}
                            components={{
                                IndicatorSeparator: () => null,
                            }}
                        />
                    ) : (
                        ""
                    )}

                    {/* Content */}
                    <textarea
                        className="focus:outline-none bg-[color:var(--post-bg-color)] text-[color:var(--text-primary-color)] text-xl sm:text-2xl h-12 sm:h-20 w-full border-b-2 mb-4 pt-2"
                        placeholder="How do you feel today?"
                        rows={3}
                        ref={inputRef}
                        onChange={(
                            event: React.ChangeEvent<HTMLTextAreaElement>
                        ) => setContent(event.currentTarget.value)}
                        value={content}
                        onFocus={() => setIsOpenSelect(true)}
                    />

                    {/* Might update in the future */}
                    {/* <div className="bg-[color:var(--post-bg-color)]  text-xl sm:text-2xl h-12 sm:h-20 w-full mb-[-5rem] pt-2 whitespace-pre-wrap">
                    {HASHTAG_FORMATTER(content)}
                </div>
                <div
                    className="focus:outline-none bg-transparent text-[color:rgba(0,0,0,0.5)] text-xl sm:text-2xl w-full border-b-2 mb-4 pt-2 whitespace-pre-wrap"
                    onInput={(event: any) => {
                        console.log(event.currentTarget.textContent);
                        setContent(event.currentTarget.textContent);
                    }}
                    contentEditable
                    suppressContentEditableWarning
                ></div> */}

                    {/* Display Files */}
                    <div>
                        {/* Image */}
                        {typeUpload !== "image" ? (
                            ""
                        ) : (
                            <div
                                className={
                                    uploadedImages.length > 1
                                        ? "columns-2 mb-4"
                                        : "columns-1 mb-4"
                                }
                            >
                                {uploadedImages.map(
                                    (imageUpload: ImageUploadProps) => (
                                        <div
                                            key={imageUpload.id}
                                            className="relative flex justify-end pt-2 sm:pt-4"
                                        >
                                            <img
                                                src={URL.createObjectURL(
                                                    imageUpload.file
                                                )}
                                                className="hum-image-post"
                                                height={1000}
                                                width={1000}
                                            />
                                            <div
                                                className="cancel-circle absolute flex justify-center items-center cursor-pointer w-[1rem] h-[1rem] sm:w-[1.5rem] sm:h-[1.5rem] mt-[-0.5rem] mr-[-0.5rem] sm:mt-[-0.75rem] sm:mr-[-0.75rem] text-[0.75rem] sm:text-[1rem]"
                                                onClick={() =>
                                                    handleRemoveImageFile(
                                                        imageUpload.id
                                                    )
                                                }
                                            >
                                                <Icon icon="times" />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {/* Audio */}
                        {typeUpload !== "audio" ? (
                            ""
                        ) : (
                            <ReactPlayer
                                url={URL.createObjectURL(uploadedAudio)}
                                controls={true}
                                width="100%"
                                height={50}
                                style={{
                                    marginBottom: "1rem",
                                }}
                            />
                        )}

                        {/* Video */}
                        {typeUpload !== "video" ? (
                            ""
                        ) : (
                            <div className="relative pt-[56.25%] mb-4">
                                <ReactPlayer
                                    url={URL.createObjectURL(uploadedVideo)}
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Create Post Options */}
                    <div className=" sm:flex sm:justify-between m-0">
                        <div className="flex items-center">
                            {/* Select Files */}
                            <button type="button">
                                <label htmlFor="audio-file">
                                    <Icon
                                        className="post-icon"
                                        icon="file-audio"
                                    />
                                </label>
                            </button>
                            <input
                                id="audio-file"
                                accept="image/jpeg,image/png,image/webp,audio/mpeg,video/mp4,video/x-msvideo,video/mpeg,video/webm"
                                type="file"
                                onChange={handleUploadFiles}
                                multiple
                                hidden
                            />

                            {/* Select Icons */}
                            <div ref={pickerRef}>
                                <button type="button">
                                    <Icon
                                        onClick={() =>
                                            setShowPicker(!showPicker)
                                        }
                                        className="post-icon mx-4 sm:mx-8"
                                        icon="face-smile"
                                    />
                                </button>
                                {showPicker && (
                                    <div className="relative">
                                        <div className="absolute z-50 mt-4 ml-[-6rem] sm:ml-[-7rem]">
                                            <EmojiPicker
                                                onEmojiClick={onEmojiClick}
                                                skinTonesDisabled
                                                width={320}
                                                height={400}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Set Publish Date */}
                            <div ref={calendarRef}>
                                <button type="button">
                                    <Icon
                                        onClick={() =>
                                            setIsOpenCalendar(!isOpenCalendar)
                                        }
                                        className="post-icon"
                                        icon="calendar-days"
                                    />
                                </button>
                                {isOpenCalendar && (
                                    <div className="relative">
                                        <div className="absolute z-50 w-96 mt-4 ml-[-10rem]">
                                            <DatePicker
                                                selected={publishedAt}
                                                onChange={
                                                    handleSelectPublishedAt
                                                }
                                                showTimeSelect
                                                inline
                                                isClearable
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="time"
                                                dateFormat="MMM d, yyyy h:mm aa"
                                                minDate={new Date()}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Create Post Button */}
                        <Button
                            className="mt-4 sm:mt-0 px-10"
                            type="submit"
                            disabled={
                                loading ||
                                (content === "" &&
                                    uploadedImages.length === 0 &&
                                    uploadedAudio === null &&
                                    uploadedVideo === null)
                            }
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const customStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        color: state.isSelected
            ? "var(--body-bg-color)"
            : "var(--teal-general-color)",
        backgroundColor: state.isSelected ? "var(--teal-general-color)" : "",
    }),
    control: (base: any) => ({
        ...base,
        border: "2px solid var(--teal-general-color)",
        boxShadow: "none",
        "&:hover": {
            border: "2px solid var(--teal-general-color)",
        },
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 700,
        marginBottom: "0.5rem",
        width: 105,
        height: 30,
        minHeight: 30,
    }),
    menu: (base: any) => ({
        ...base,
        width: 278,
    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: "0 8px",
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: "0px",
        paddingLeft: "0px",
        paddingTop: "0px",
        paddingRight: "8px",
        paddingDown: "0px",
    }),
    singleValue: (provided: any) => {
        return { ...provided };
    },
};

export default PostCreate;
