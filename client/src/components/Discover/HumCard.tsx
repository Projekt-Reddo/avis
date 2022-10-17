import { useEffect, useRef, useState } from "react";

// Libs
import { Link, useHistory } from "react-router-dom";
import { useAppSelector } from "utils/react-redux-hooks";
import ReactPlayer from "react-player";
import moment from "moment";

// Components
import Icon from "components/shared/Icon";
import Modal from "components/Modal/Modal";
import { addNewToast } from "components/Toast";

// Constants
import { DayFormat } from "utils/constants";
import { useModal } from "components/Modal";

// Styles
import "theme/Discover.css";

interface HumCardProps {
    post: Post;
}

const HumCard: React.FC<HumCardProps> = ({ post }) => {
    const authState = useAppSelector((state) => state.auth.data);

    const [showOptions, setShowOptions] = useState<string>();

    const { open: openReport, setOpen: setOpenReport } = useModal();

    const history = useHistory();

    const handleReport = () => {};

    const handleSave = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        console.log("Save");
    };

    const handleUpvote = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (post.upvotedBy.includes(authState?.uid)) {
            console.log("Voted");
            return;
        }
        console.log("Like");
    };

    const handleDownvote = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (post.downvotedBy.includes(authState?.uid)) {
            console.log("Voted");
            return;
        }
        console.log("Dislike");
    };

    const handleUnauthorize = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        addNewToast({
            variant: "warning",
            message: "Please login to use this function",
        });
    };

    // State click outside
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setShowOptions);

    return (
        <>
            <Link
                to={`/discover/${post.id}`}
                className="hum-card grid grid-cols-5 sm:grid-cols-10 gap-4 min-w-[20rem] p-4 lg:mt-4 border-t-0"
            >
                <div className="col-span-1">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                        <div
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.preventDefault();
                                history.push(`/profile/${post.user.id}`);
                            }}
                            className="avatar"
                            style={{
                                backgroundImage: `url(${post.user.avatar})`,
                            }}
                        />
                    </div>

                    {/* Vote */}
                    <div className="flex justify-center items-center">
                        <div>
                            <Icon
                                className={
                                    post.upvotedBy.includes(authState?.uid)
                                        ? "text-5xl cursor-pointer text-[color:var(--teal-lighter-color)]"
                                        : "text-5xl cursor-pointer text-[color:var(--text-secondary-color)] hover:text-[color:var(--teal-general-color)]"
                                }
                                icon="caret-up"
                                onClick={
                                    authState ? handleUpvote : handleUnauthorize
                                }
                            />
                            <div className="text-center text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[4rem]">
                                {post.upvotedBy.length -
                                    post.downvotedBy.length}
                            </div>
                            <Icon
                                className={
                                    post.downvotedBy.includes(authState?.uid)
                                        ? "text-5xl cursor-pointer text-[color:var(--teal-lighter-color)]"
                                        : "text-5xl cursor-pointer text-[color:var(--text-secondary-color)] hover:text-[color:var(--teal-general-color)]"
                                }
                                icon="caret-down"
                                onClick={
                                    authState
                                        ? handleDownvote
                                        : handleUnauthorize
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-4 sm:col-span-9 relative">
                    {/* Post Info */}
                    <div className="flex justify-between relative">
                        <div className="flex">
                            <div
                                onClick={(
                                    event: React.MouseEvent<HTMLElement>
                                ) => {
                                    event.preventDefault();
                                    history.push(`/profile/${post.user.id}`);
                                }}
                                className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[5rem] sm:max-w-[10rem] hover:underline"
                            >
                                {post.user.name}
                            </div>
                            <div className="ml-4 text-ellipsis">
                                {moment(post.publishedAt).format(DayFormat)}
                            </div>
                        </div>
                        <div
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.preventDefault();
                                setShowOptions(post.id);
                            }}
                        >
                            <Icon
                                className="text-2xl cursor-pointer hover:text-[color:var(--teal-general-color)]"
                                icon="ellipsis"
                            />
                        </div>
                        {showOptions === post.id ? (
                            <button
                                ref={wrapperRef}
                                onClick={
                                    authState
                                        ? (
                                              event: React.MouseEvent<HTMLElement>
                                          ) => {
                                              event.preventDefault();
                                              setOpenReport(true);
                                          }
                                        : handleUnauthorize
                                }
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
                    <div className="pb-8">
                        <div className="mb-4">{post.content}</div>
                        <div
                            className="cursor-auto"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.preventDefault();
                            }}
                        >
                            {/* Image */}
                            <div
                                className={
                                    post.medias.length > 1
                                        ? "columns-2 mb-4"
                                        : "columns-1 mb-4"
                                }
                            >
                                {post.medias
                                    .filter(
                                        (media) =>
                                            media.mediaType.toLowerCase() ===
                                            "image"
                                    )
                                    .map((media) => (
                                        <img
                                            key={media.id}
                                            src={media.url}
                                            className="hum-image-post"
                                            height={1000}
                                            width={1000}
                                        />
                                    ))}
                            </div>
                            {/* Audio */}
                            {post.medias
                                .filter(
                                    (media) =>
                                        media.mediaType.toLowerCase() ===
                                        "audio"
                                )
                                .map((media) => (
                                    <ReactPlayer
                                        key={media.id}
                                        url={media.url}
                                        controls={true}
                                        width="100%"
                                        height={50}
                                        style={{
                                            marginBottom: "1rem",
                                        }}
                                    />
                                ))}

                            {/* Video */}
                            {post.medias
                                .filter(
                                    (media) =>
                                        media.mediaType.toLowerCase() ===
                                        "video"
                                )
                                .map((media) => (
                                    <div
                                        key={media.id}
                                        className="relative pt-[56.25%] mb-4"
                                    >
                                        <ReactPlayer
                                            url={media.url}
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
                                ))}
                        </div>
                    </div>

                    {/* Other */}
                    <div className="flex justify-between absolute bottom-0 right-0 left-0 text-[color:var(--text-secondary-color)] pb-2">
                        <div className="flex">
                            {/* Comment */}
                            <div className="flex cursor-pointer hover:text-[color:var(--teal-general-color)]">
                                <Icon className="text-2xl" icon="message" />
                                <div className="ml-1 sm:hidden">
                                    {post.commentCount}
                                </div>
                                <div className="ml-1 hidden sm:block">
                                    {post.commentCount} Comment
                                </div>
                            </div>

                            {/* Share */}
                            <div
                                onClick={(
                                    event: React.MouseEvent<HTMLElement>
                                ) => {
                                    event.preventDefault();

                                    // Copy current url to clipboard
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}${location.pathname}/${post.id}`
                                    );

                                    addNewToast({
                                        variant: "primary",
                                        message:
                                            "Copy to clipboard successfully",
                                    });
                                }}
                                className="flex mx-2 cursor-pointer sm:mx-4 hover:text-[color:var(--teal-general-color)]"
                            >
                                <Icon className="text-2xl" icon="share" />
                                <div className="ml-1 hidden sm:block">
                                    Share
                                </div>
                            </div>

                            {/* Save */}
                            <div
                                onClick={
                                    authState ? handleSave : handleUnauthorize
                                }
                                className="flex cursor-pointer hover:text-[color:var(--teal-general-color)]"
                            >
                                <Icon className="text-2xl" icon="bookmark" />
                                <div className="ml-1 hidden sm:block">Save</div>
                            </div>
                        </div>
                        <div className="text-xs self-center">
                            {post.upvotedBy.length + post.downvotedBy.length ===
                            0
                                ? "No voted"
                                : post.upvotedBy >= post.downvotedBy
                                ? (
                                      (post.upvotedBy.length * 100) /
                                      (post.upvotedBy.length +
                                          post.downvotedBy.length)
                                  ).toFixed() + "%  Upvoted"
                                : (
                                      (post.downvotedBy.length * 100) /
                                      (post.upvotedBy.length +
                                          post.downvotedBy.length)
                                  ).toFixed() + "%  Downvoted"}
                        </div>
                    </div>
                </div>
            </Link>

            <Modal
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
            />
        </>
    );
};

// Handle click outside
export function useOutsideAlerter(ref: any, setShowOption: any) {
    useEffect(() => {
        /**
         * Set listData to null
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowOption();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default HumCard;
