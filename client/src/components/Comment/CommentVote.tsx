// Libs
import { useAppSelector } from "utils/react-redux-hooks";

// Components
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";

// Styles
import "theme/Discover.css";
import { voteApi } from "api/vote-api";
import React from "react";

interface CommentVoteProps {
    comment: Comment;
}

const CommentVote: React.FC<CommentVoteProps> = ({ comment }) => {
    const authState = useAppSelector((state) => state.auth.data);

    const [upvotedBy, setupVotedBy] = React.useState(comment.upvotedBy);

    const [downvotedBy, setdownvotedBy] = React.useState(comment.downvotedBy);

    const handleUpvote = async (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        await voteApi({
            voteId: comment.id,
            isUpvote: true,
            isVotePost: false,
        }).then((data) => UpdatePost(data));
    };

    const handleDownvote = async (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        await voteApi({
            voteId: comment.id,
            isUpvote: false,
            isVotePost: false,
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
            {/* Vote*/}
            <div className="flex items-center">
                <Icon
                    className={
                        upvotedBy.includes(authState?.uid)
                        ? "text-5xl cursor-pointer text-[color:var(--teal-lighter-color)]"
                        : "text-5xl cursor-pointer text-[color:var(--text-secondary-color)] hover:text-[color:var(--teal-general-color)]"
                            }
                        size="xl"
                        icon="caret-up"
                        onClick={authState ? handleUpvote : handleUnauthorize}/>
                            <div className="font-bold whitespace-nowrap max-w-[4rem] mx-1 text-xl">
                                {upvotedBy.length -
                                    downvotedBy.length}
                            </div>
                            <Icon
                                className={
                                    downvotedBy.includes(authState?.uid)
                                    ? "text-5xl cursor-pointer text-[color:var(--teal-lighter-color)]"
                                    : "text-5xl cursor-pointer text-[color:var(--text-secondary-color)] hover:text-[color:var(--teal-general-color)]"
                                }
                                size="xl"
                                icon="caret-down"
                                onClick={authState ? handleDownvote : handleUnauthorize}
                            />
                        </div>
        </>
    );
};

export default CommentVote;
