// import { useOutsideAlerter } from "components/Discover/HumCard";
import Icon from "components/shared/Icon";
import moment from "moment";
import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { DAY_FORMAT } from "utils/constants";
import { useAppSelector } from "utils/react-redux-hooks";

interface commentData {
    userId: string;
    user: {
        name: string;
        email: string;
        avatar: string;
        uid: string;
        role: string;
    };
    content: string;
    upvotedBy: [string];
    downvotedBy: [string];
    // comments: [string];
    media: {
        mediaType: string;
        mimeType: string;
        url: string;
        id: string;
    };
    id: string;
    createdAt: string;
    modifiedAt: string;
}

interface CommenteCardProps {
    comment: Comment;
}

const CommentCard: React.FC<CommenteCardProps> = ({ comment }) => {
    const authState = useAppSelector((state) => state.auth.data);

    const [showOptions, setShowOptions] = useState<string>();

    return (
        <>
            <div className="hum-card grid grid-cols-5 sm:grid-cols-10 gap-4 min-w-[20rem] p-4 lg:mt-4 border-t-0">
                <div className="col-span-1">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                        <Link
                            to={`/profile/${comment.user.id}`}
                            className="avatar"
                            style={{
                                backgroundImage: `url(${comment.user.avatar})`,
                            }}
                        />
                    </div>
                </div>

                <div className="col-span-4 sm:col-span-9 relative">
                    {/* comment Info */}
                    <div className="flex justify-between relative">
                        <div className="flex">
                            <Link
                                to={`/profile/${comment.user.id}`}
                                className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[5rem] sm:max-w-[10rem] hover:underline"
                            >
                                {comment.user.name}
                            </Link>
                            <div className="ml-4 text-ellipsis">
                                {moment(comment.createdAt).format(DAY_FORMAT)}
                            </div>
                        </div>
                        <div
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.preventDefault();
                                setShowOptions(comment.id);
                            }}
                        >
                            <Icon
                                className="text-2xl cursor-pointer hover:text-[color:var(--teal-general-color)]"
                                icon="ellipsis"
                            />
                        </div>
                        {showOptions === comment.id ? (
                            <button
                                onClick={(
                                    event: React.MouseEvent<HTMLElement>
                                ) => {
                                    event.preventDefault();
                                    //   setOpenReport(true);
                                }}
                                className="search-card font-bold top-0 right-0 absolute px-8 py-2 z-50 hover:bg-[color:var(--post-bg-hover-color)]"
                            >
                                <Icon icon="flag" className="mr-4" />
                                Report Post
                            </button>
                        ) : (
                            ""
                        )}
                    </div>

                    {/* Content */}
                    <div className="pb-8 rounded-md bg-[color:var(--comment-bg-body-color)]">
                        <div className="mb-4 p-4">{comment.content}</div>
                        <div
                            className="cursor-auto"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.preventDefault();
                            }}
                        >
                            {!comment.media ? (
                                ""
                            ) : comment.media.mediaType == "image" ? (
                                <div className={"mb-4 columns-2"}>
                                    <img
                                        key={comment.media.id}
                                        src={comment.media.url}
                                        className="hum-image-post"
                                    />
                                </div>
                            ) : comment.media.mediaType == "audio" ? (
                                <ReactPlayer
                                    key={comment.media.id}
                                    url={comment.media.url}
                                    controls={true}
                                    width="100%"
                                    height={50}
                                    style={{
                                        marginBottom: "1rem",
                                    }}
                                />
                            ) : comment.media.mediaType == "video" ? (
                                <div className="relative pt-[56.25%] mb-4">
                                    <ReactPlayer
                                        url={comment.media.url}
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
                            ) : (
                                ""
                            )}
                        </div>
                    </div>

                    {/* Other */}
                    <div className="flex justify-between absolute bottom-0 right-0 left-0 text-[color:var(--text-secondary-color)] pb-2">
                        <div className="flex">
                            {/* Vote*/}

                            <div className="flex items-center">
                                <Icon
                                    className={
                                        authState &&
                                        comment.upvotedBy.includes(
                                            authState?.uid
                                        )
                                            ? "flex cursor-pointer text-3xl hover:text-[color:var(--teal-general-color)]"
                                            : "flex cursor-pointer text-3xl hover:text-[color:var(--teal-general-color)]"
                                    }
                                    icon="caret-up"
                                    onClick={(
                                        event: React.MouseEvent<HTMLElement>
                                    ) => {
                                        event.preventDefault();
                                        if (
                                            authState &&
                                            comment.upvotedBy.includes(
                                                authState?.uid
                                            )
                                        ) {
                                            console.log("Voted");
                                            return;
                                        }
                                        console.log("Like");
                                    }}
                                />
                                <div className="text-center text-3xl font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[4rem] mx-2">
                                    {comment.upvotedBy.length -
                                        comment.downvotedBy.length}
                                </div>
                                <Icon
                                    className={
                                        authState &&
                                        comment.downvotedBy.includes(
                                            authState?.uid
                                        )
                                            ? "flex cursor-pointer text-3xl hover:text-[color:var(--teal-general-color)]"
                                            : "flex cursor-pointer text-3xl hover:text-[color:var(--teal-general-color)]"
                                    }
                                    icon="caret-down"
                                    onClick={(
                                        event: React.MouseEvent<HTMLElement>
                                    ) => {
                                        event.preventDefault();
                                        if (
                                            authState &&
                                            comment.downvotedBy.includes(
                                                authState?.uid
                                            )
                                        ) {
                                            console.log("Voted");
                                            return;
                                        }
                                        console.log("Dislike");
                                    }}
                                />
                            </div>

                            {/* Comment */}
                            {/* {!comment.comments ? (
                                ""
                            ) : (
                                <div className="flex cursor-pointer hover:text-[color:var(--teal-general-color)]">
                                    <Icon className="text-2xl" icon="message" />
                                    <div className="ml-1 sm:hidden">
                                        {comment.comments.length}
                                    </div>
                                    <div className="ml-1 hidden sm:block">
                                        {comment} Comment
                                    </div>
                                </div>
                            )} */}

                            {/* Share */}
                            <div
                                onClick={(
                                    event: React.MouseEvent<HTMLElement>
                                ) => {
                                    event.preventDefault();

                                    // Copy current url to clipboard
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}${location.pathname}/${comment.id}`
                                    );

                                    //   addNewToast({
                                    //     variant: "primary",
                                    //     message: "Copy to clipboard successfully",
                                    //   });
                                }}
                                className="flex mx-2 cursor-pointer sm:mx-4 hover:text-[color:var(--teal-general-color)]"
                            >
                                <Icon className="text-2xl" icon="share" />
                                <div className="ml-1 hidden sm:block">
                                    Share
                                </div>
                            </div>

                            {/* Save */}
                            <div className="flex cursor-pointer hover:text-[color:var(--teal-general-color)]">
                                <Icon className="text-2xl" icon="bookmark" />
                                <div className="ml-1 hidden sm:block">Save</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Modal
        type="warning"
        open={openReport}
        setOpen={setOpenReport}
        title="Report"
        message=""
        modalBody={
          <div className="w-[25rem] rounded p-2 border-solid border-2 border-sky-500s">
            In Development
          </div>
        }
        confirmTitle="Delete"
        onConfirm={handleReport}
      /> */}
        </>
    );
};

export default CommentCard;
function setShowOptions(id: string) {
    throw new Error("Function not implemented.");
}
