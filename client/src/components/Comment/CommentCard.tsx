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

    return (
        <>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-4 min-w-[20rem] px-4 border-t-0">
                {/* Avatar */}
                <div className="col-span-1 flex justify-center">
                    <Link
                        to={`/profile/${comment.user.id}`}
                        className="avatar"
                        style={{
                            backgroundImage: `url(${comment.user.avatar})`,
                        }}
                    />
                </div>

                {/* Right conent */}
                <div className="col-span-4 sm:col-span-9 relative bg-[color:var(--comment-bg-body-color)] p-4 rounded-md">
                    {/* comment Info */}
                    <div className="flex gap-4">
                        <Link
                            to={`/profile/${comment.user.id}`}
                            className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[5rem] sm:max-w-[10rem]"
                        >
                            {comment.user.name}
                        </Link>
                        <div className="text-ellipsis">
                            {moment(comment.createdAt).format(DAY_FORMAT)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4">
                        <div className="mt-3">{comment.content}</div>
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
                                <div className={"mb-4"}>
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
                                </div>
                            ) : comment.media.mediaType == "video" ? (
                                <div className="relative pt-[56.25%] mb-4">
                                    <div className={"mb-4"}>
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
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>

                    {/* Other */}
                    <div className="flex items-center gap-4">
                        {/* Vote*/}
                        <div className="flex items-center">
                            <Icon
                                className={
                                    authState &&
                                    comment.upvotedBy.includes(authState?.uid)
                                        ? "cursor-pointer hover:text-[color:var(--teal-general-color)] mt-1"
                                        : "cursor-pointer hover:text-[color:var(--teal-general-color)] mt-1"
                                }
                                size="xl"
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
                            <div className="font-bold whitespace-nowrap max-w-[4rem] mx-1 text-xl">
                                {comment.upvotedBy.length -
                                    comment.downvotedBy.length}
                            </div>
                            <Icon
                                className={
                                    authState &&
                                    comment.downvotedBy.includes(authState?.uid)
                                        ? "cursor-pointer hover:text-[color:var(--teal-general-color)] mb-1"
                                        : "cursor-pointer hover:text-[color:var(--teal-general-color)] mb-1"
                                }
                                size="xl"
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

                        {/* Reply */}
                        <Icon
                            icon="reply"
                            className="cursor-pointer hover:text-[color:var(--teal-general-color)]"
                        />

                        {/* Report */}
                        <Icon
                            icon="flag"
                            className="cursor-pointer hover:text-[color:var(--teal-general-color)]"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommentCard;
