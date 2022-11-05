import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "components/shared/Icon";
import React, { useState } from "react";
import { FunctionComponent } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import yup from "utils/yup-config";
import TextareaAutosize from "react-textarea-autosize";
import Button from "components/Button/Button";
import { COMMENT_LENGTH } from "utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useOutsideClick } from "utils/useOutsideClick";
import FileDropzone from "components/shared/FileDropzone";
import MediaDisplay from "./MediaDisplay";
import { createCommentAsync } from "store/slices/commentSlice";

interface CommentCreateProps {
    parentId: string;
    isPostChild: boolean;
}

const CommentCreate: FunctionComponent<CommentCreateProps> = ({
    parentId,
    isPostChild,
}) => {
    const auth = useAppSelector((state) => state.auth);

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
    const { register, handleSubmit, getValues, setValue, watch, reset } =
        useForm({
            mode: "onChange",
            resolver: yupResolver(schema),
            defaultValues: {
                content: "",
                media: null,
            },
        });
    const watchFiles = watch(mediaField);

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
                        })`,
                    }}
                />
            </div>

            {/* Right conent */}
            <form
                className={`flex flex-col border-[0.5px] sm:col-span-9 relative bg-[color:var(--comment-bg-body-color)] rounded-md`}
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextareaAutosize
                    placeholder="Enter your comment"
                    rows={1}
                    style={{
                        resize: "none",
                    }}
                    className="bg-transparent p-3 focus:border-none focus:outline-none h-auto"
                    {...register(contentField)}
                    onChange={(e) => {
                        setRemainLetter(COMMENT_LENGTH - e.target.value.length);
                    }}
                    onFocus={() => {
                        setIsFocusInput(true);
                    }}
                />

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
                                                }}
                                                skinTonesDisabled
                                                width={320}
                                                height={400}
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
                                    className={`${
                                        remainLetter < 0 && "text-red-500"
                                    }`}
                                >
                                    Remain: {remainLetter}
                                </p>
                            )}

                            <Button
                                variant="primary"
                                className="shadow-none"
                                disabled={
                                    remainLetter < 0 ||
                                    (remainLetter === COMMENT_LENGTH &&
                                        !watchFiles)
                                }
                                type={"submit"}
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
