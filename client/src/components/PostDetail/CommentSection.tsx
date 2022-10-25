import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import {
    viewCommentAsync,
    viewMoreCommentAsync,
} from "store/slices/commentSlice";
import Comment from "./CommentCard";
import { useHistory, useParams } from "react-router-dom";
import CommentCard from "./CommentCard";
import Loading from "components/shared/Loading";
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
        <>
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
            ) : (
                <InfiniteScroll
                    dataLength={commentState.data.payload.length}
                    next={fetchData}
                    hasMore={
                        commentState.data.total -
                            commentState.data.payload.length >
                        0
                    }
                    className="page-wrapper"
                    style={{
                        margin: "0 -1rem",
                        padding: "0 1rem",
                        minHeight: "100vh",
                    }}
                    height={
                        500
                        // width! > MOBILE_BREAKPOINT
                        //     ? height! - 80
                        //     : height! - 128
                    }
                    loader={
                        // Loading
                        <div className="flex justify-center items-center my-4">
                            <Loading />
                        </div>
                    }
                    endMessage={
                        <div className="flex justify-center items-center font-bold my-4">
                            Post to view more
                        </div>
                    }
                >
                    {commentState?.data?.payload.map((comment: Comment) => (
                        <div
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                if (
                                    isPostChild &&
                                    comment.comments.length > 0
                                ) {
                                    history.push({
                                        pathname: `/discover/comment/${comment.id}`,
                                    });
                                }
                            }}
                            key={comment.id + Date.now()}
                        >
                            <CommentCard
                                comment={comment}
                                key={comment.id + Date.now()}
                            />
                        </div>
                    ))}
                </InfiniteScroll>
            )}
        </>
    );
};

export default CommentSection;
