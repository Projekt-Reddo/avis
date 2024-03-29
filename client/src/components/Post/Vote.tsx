// Libs
import { useAppSelector } from "utils/react-redux-hooks";

// Components
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";

// Styles
import "theme/Discover.css";
import { voteApi } from "api/vote-api";
import React from "react";

interface VoteProps {
    post: Post;
}

const Vote: React.FC<VoteProps> = ({ post }) => {
    const authState = useAppSelector((state) => state.auth.data);

    const [upvotedBy, setupVotedBy] = React.useState(post.upvotedBy);

    const [downvotedBy, setdownvotedBy] = React.useState(post.downvotedBy);

    const handleUpvote = async (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        await voteApi({
            voteId: post.id,
            isUpvote: true,
            isVotePost: true,
        }).then((data) => UpdatePost(data));
    };

    const handleDownvote = async (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        await voteApi({
            voteId: post.id,
            isUpvote: false,
            isVotePost: true,
        }).then((data) => UpdatePost(data));
    };

    const handleUnauthorize = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        addNewToast({
            variant: "warning",
            message: "Please login to use this function",
        });
    };

    const UpdatePost = (data: any) => {
        setupVotedBy(data.upVote);

        setdownvotedBy(data.downVote);
    };

    return (
        <>
            <div className="flex justify-center items-center">
                <div>
                    <Icon
                        className={
                            upvotedBy.includes(authState?.uid)
                                ? "text-5xl cursor-pointer text-[color:var(--teal-lighter-color)]"
                                : "text-5xl cursor-pointer text-[color:var(--text-secondary-color)] hover:text-[color:var(--teal-general-color)]"
                        }
                        icon="caret-up"
                        onClick={authState ? handleUpvote : handleUnauthorize}
                        data-cy="post-upvote-btn"
                    />
                    <div className="text-center text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[4rem]">
                        {upvotedBy.length - downvotedBy.length}
                    </div>
                    <Icon
                        className={
                            downvotedBy.includes(authState?.uid)
                                ? "text-5xl cursor-pointer text-[color:var(--teal-lighter-color)]"
                                : "text-5xl cursor-pointer text-[color:var(--text-secondary-color)] hover:text-[color:var(--teal-general-color)]"
                        }
                        icon="caret-down"
                        onClick={authState ? handleDownvote : handleUnauthorize}
                        data-cy="post-downvote-btn"
                    />
                </div>
            </div>
        </>
    );
};

export default Vote;
