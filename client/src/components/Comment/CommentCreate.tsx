import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "components/shared/Icon";
import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { FieldValues, useForm, useWatch } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import yup from "utils/yup-config";
import TextareaAutosize from "react-textarea-autosize";
import Button from "components/Button/Button";
import { COMMENT_LENGTH, DAY_FORMAT } from "utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useOutsideClick } from "utils/useOutsideClick";
import FileDropzone from "components/shared/FileDropzone";
import MediaDisplay from "./MediaDisplay";
import { createCommentAsync } from "store/slices/commentSlice";
import { Theme } from "emoji-picker-react";
import moment from "moment";

interface CommentCreateProps {
    parentId: string;
    isPostChild: boolean;
}

const CommentCreate: FunctionComponent<CommentCreateProps> = ({
    parentId,
    isPostChild,
}) => {
    const auth = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.theme);

    const [remainLetter, setRemainLetter] = useState(COMMENT_LENGTH);

    const [isFocusInput, setIsFocusInput] = useState(false);
    const createCommentRef = React.useRef(null);
    useOutsideClick(createCommentRef, () => {
        setIsFocusInput(false);
    });

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = React.useRef(null);
    useOutsideClick(emojiPickerRef, () => {
        setShowEmojiPicker(false);
    });

    const contentField = "content";
    const mediaField = "media";
    const schema = yup.object().shape({
        content: yup.string().nullable(true),
        media: yup.mixed().nullable(true),
    });
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            content: "",
            media: null,
        },
    });
    const watchFiles = watch(mediaField);
    const watchContent = watch(contentField);
    const [isDisableSubmit, setIsDisableSubmit] = useState(true);

    useEffect(() => {
        if (
            remainLetter < 0 ||
            (remainLetter === COMMENT_LENGTH && !watchFiles) ||
            (!watchContent.replace(/\s/g, "").length && !watchFiles)
        ) {
            setIsDisableSubmit(true);
        } else {
            setIsDisableSubmit(false);
        }
    }, [watchContent, watchFiles]);

    const handleRemoveFile = () => {
        setValue(mediaField, null);
    };

    const handleReset = () => {
        setRemainLetter(COMMENT_LENGTH);
        reset();
        setIsFocusInput(false);
    };

    const dispatch = useAppDispatch();
    const onSubmit = (values: FieldValues) => {
        handleReset();
        dispatch(
            createCommentAsync({
                content: values.content,
                userId: auth.data.uid,
                media: values.media,
                postId: isPostChild ? parentId : undefined,
                commentId: !isPostChild ? parentId : undefined,
            })
        );
    };

    if (!auth.data) {
        return <></>;
    }

    if (auth.data && auth.data.status && auth.data.status.CommentMutedUntil) {
        return (
            <div
                className="flex gap-3 m-4 lg:mx-0 p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800 items-center"
                role="alert"
            >
                <Icon icon="triangle-exclamation" size="lg" />
                <div>
                    Your account is muted until{" "}
                    {moment(auth.data.status.CommentMutedUntil).format(
                        DAY_FORMAT
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="grid grid-cols-5 sm:grid-cols-10 gap-4 min-w-[20rem]"
            ref={createCommentRef}
        >
            {/* Avatar */}
            <div className="col-span-1 flex justify-center">
                <div
                    className="avatar"
                    style={{
                        backgroundImage: `url(${
                            auth.status === "idle" ? auth.data.avatar : ""
                        }?${new Date().toISOString()})`,
                    }}
                />
            </div>

            {/* Right conent */}
            <form
                className={`flex flex-col border-[0.5px] border-[color:var(--element-bg-color-elevate-1)] col-span-4 sm:col-span-9 relative bg-[color:var(--comment-bg-body-color)] rounded-md`}
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextareaAutosize
                    placeholder="Enter your comment"
                    rows={1}
                    style={{
                        resize: "none",
                    }}
                    className="bg-transparent p-3 focus:border-none focus:outline-none h-auto"
                    {...register(contentField, {
                        onChange: (e) => {
                            setRemainLetter(
                                COMMENT_LENGTH - e.target.value.length
                            );
                        },
                    })}
                    onFocus={() => {
                        setIsFocusInput(true);
                    }}
                    data-cy="comment-textarea"
                />

                {errors.content && errors.content.message}

                <MediaDisplay
                    file={watchFiles}
                    handleRemoveFile={handleRemoveFile}
                />

                {isFocusInput && (
                    <div className="flex flex-row justify-between items-center p-3">
                        <div className="flex flex-row justify-start items-center gap-3">
                            {/* Emoji picker */}
                            <div ref={emojiPickerRef}>
                                <Icon
                                    icon="face-smile"
                                    className="opacity-50 cursor-pointer"
                                    size="lg"
                                    onClick={() =>
                                        setShowEmojiPicker(!showEmojiPicker)
                                    }
                                />
                                {showEmojiPicker && (
                                    <div className="relative">
                                        <div className="absolute z-50 mt-4 ml-[-6rem] sm:ml-[-7rem]">
                                            <EmojiPicker
                                                onEmojiClick={(e) => {
                                                    setValue(
                                                        contentField,
                                                        getValues(
                                                            contentField
                                                        ) + e.emoji
                                                    );
                                                    setRemainLetter(
                                                        (prev) =>
                                                            prev -
                                                            e.emoji.length
                                                    );
                                                }}
                                                skinTonesDisabled
                                                width={320}
                                                height={400}
                                                theme={
                                                    theme.status === "idle" &&
                                                    theme.data.value === "dark"
                                                        ? Theme.DARK
                                                        : Theme.LIGHT
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* File picker */}
                            <label htmlFor="input-file">
                                <Icon
                                    icon="file-audio"
                                    className="opacity-50 cursor-pointer"
                                    size="lg"
                                />
                            </label>
                            <FileDropzone
                                id={"input-file"}
                                accept={{
                                    "audio/mpeg": [".mp3"],
                                    "image/*": [
                                        ".png",
                                        ".jpg",
                                        ".jpeg",
                                        ".jfif",
                                        ".webp",
                                    ],
                                    "video/*": [".mpeg", ".mp4", ".webm"],
                                }}
                                maxFile={1}
                                fileInputField={mediaField}
                                getValues={getValues}
                                setValue={setValue}
                                hidden={true}
                            />
                        </div>

                        <div className="flex flex-row justify-start items-center gap-3">
                            {/* Remain letter count */}
                            {remainLetter !== COMMENT_LENGTH && (
                                <p
                                    className={`text-sm ${
                                        remainLetter < 0 && "text-red-500"
                                    }`}
                                >
                                    {remainLetter} left
                                </p>
                            )}

                            <Button
                                variant="primary"
                                className="shadow-none"
                                disabled={isDisableSubmit}
                                type={"submit"}
                                data-cy="comment-create-button"
                            >
                                <Icon
                                    icon="paper-plane"
                                    className="mr-3"
                                    size="lg"
                                />
                                Reply
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CommentCreate;
