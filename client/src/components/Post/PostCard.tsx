// Libs
import { Link, useHistory } from "react-router-dom";
import ReactPlayer from "react-player";
import moment from "moment";

// Components
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";

// Constants
import { DAY_FORMAT } from "utils/constants";

// Styles
import "theme/Discover.css";
import PostOptions from "components/Post/PostOptions";
import Vote from "./Vote";
import SavePost from "./SavePost";

interface PostCardProps {
    post: Post;
    isDetailPage?: boolean;
    style?: string;
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    isDetailPage = false,
    style = "",
}) => {
    const history = useHistory();

    const handleViewDetail = () => {
        if (isDetailPage) {
            return;
        }
        history.push(`/discover/${post.id}`);
    };

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
        <>
            <div
                className={`hum-card drop-shadow-md grid grid-cols-5 sm:grid-cols-10 gap-4 min-w-[20rem] p-4 lg:mb-4 border-t-0 ${
                    isDetailPage ? "" : "cursor-pointer"
                } ${style}`}
                onClick={handleViewDetail}
                data-cy="post-card"
            >
                <div className="col-span-1">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4 cursor-pointer">
                        <div
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.stopPropagation();
                                history.push(`/profile/${post.user.id}`);
                            }}
                            className="avatar"
                            style={{
                                backgroundImage: `url(${post.user.avatar})`,
                            }}
                            data-cy="avatar-post"
                        />
                    </div>

                    {/* Vote */}
                    <Vote post={post} />
                </div>

                <div className="col-span-4 sm:col-span-9 relative">
                    {/* Post Info */}
                    <div className="flex justify-between relative">
                        <div className="flex">
                            <div
                                onClick={(
                                    event: React.MouseEvent<HTMLElement>
                                ) => {
                                    event.stopPropagation();
                                    history.push(`/profile/${post.user.id}`);
                                }}
                                className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[5rem] sm:max-w-[10rem] hover:underline cursor-pointer"
                            >
                                {post.user.name}
                            </div>
                            <div className="ml-4 text-ellipsis">
                                {moment(post.publishedAt).format(DAY_FORMAT)}
                            </div>
                        </div>

                        <PostOptions post={post} />
                    </div>

                    {/* Content */}
                    <div className="pb-8">
                        <div
                            className="whitespace-pre-wrap mb-4"
                            data-cy="post-card-content"
                        >
                            {post.content
                                ? HASHTAG_FORMATTER(post.content)
                                : ""}
                        </div>
                        <div
                            className="cursor-auto"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.stopPropagation();
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
                                    event.stopPropagation();

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
                            <SavePost post={post} />
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
            </div>
        </>
    );
};

export default PostCard;
