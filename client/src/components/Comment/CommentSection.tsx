import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import {
    viewCommentAsync,
    viewMoreCommentAsync,
} from "store/slices/commentSlice";
import { useHistory } from "react-router-dom";
import CommentCard from "./CommentCard";
import Loading from "components/shared/Loading";
import CommentCreate from "./CommentCreate";
import InfiniteScroll from "react-infinite-scroll-component";

interface CommentSectionProps {
    postId: string;
    isPostChild: boolean;
    commentData?: Comment;
}

interface PageFilterCommentProps {
    currentPage: number;
    rowShow: number;
    filter?: {
        objectId: string;
        isPostChild: boolean;
        sort: string;
    };
}

const CommentSection: React.FC<CommentSectionProps> = ({
    postId,
    isPostChild,
    commentData,
}) => {
    const dispatch = useAppDispatch();

    const commentState = useAppSelector((state) => state.comment);

    const [fetchMorePage, setFetchMorePage] = React.useState(2);

    const history = useHistory();

    const [pageFilter, setPageFilter] = React.useState<PageFilterCommentProps>({
        currentPage: 1,
        rowShow: 10,
        filter: {
            objectId: postId,
            isPostChild: isPostChild,
            sort: "Upvoted Descending",
        },
    });

    useEffect(() => {
        dispatch(
            viewCommentAsync({
                page: pageFilter.currentPage,
                size: pageFilter.rowShow,
                filter: pageFilter.filter,
            })
        );
    }, [pageFilter]);

    const fetchData = () => {
        dispatch(
            viewMoreCommentAsync({
                page: fetchMorePage,
                size: pageFilter.rowShow,
                filter: pageFilter.filter,
            })
        );
        setFetchMorePage(fetchMorePage + 1);
    };

    return (
        <div className="bg-[color:var(--bg-color)] sm:bg-[color:var(--post-bg-color)] rounded-lg drop-shadow-md p-4 mb-0 sm:mb-3 flex flex-col gap-4">
            <CommentCreate parentId={postId} isPostChild={isPostChild} />

            {commentState.status === "loading" || !commentState.data ? (
                // Loading
                <div className="flex justify-center items-center mt-8">
                    <Loading />
                </div>
            ) : commentState.status === "error" ? (
                // Error
                <div className="flex justify-center items-center mt-8 text-lg">
                    <div>{commentState.status}</div>
                </div>
            ) : commentState.status === "idle" &&
              commentState.data.total === 0 ? (
                <div className="w-full grid place-items-center">
                    No comment found
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={commentState.data.payload.length}
                    next={fetchData}
                    hasMore={
                        commentState.data.total -
                            commentState.data.payload.length >
                        0
                    }
                    className=""
                    loader={
                        <div className="flex justify-center items-center my-4">
                            <Loading />
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4">
                        {commentState?.data?.payload.map((comment: Comment) => (
                            <div
                                onClick={(
                                    event: React.MouseEvent<HTMLElement>
                                ) => {
                                    if (isPostChild) {
                                        history.push({
                                            pathname: `/discover/comment/${comment.id}`,
                                        });
                                    }
                                }}
                                key={comment.id + Date.now()}
                                className={isPostChild ? `cursor-pointer` : ``}
                            >
                                <CommentCard
                                    comment={comment}
                                    key={comment.id + Date.now()}
                                />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            )}
        </div>
    );
};

export default CommentSection;
