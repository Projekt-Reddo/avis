import PageWrapper from "components/PageWrapper/PageWrapper";
import CommentCard from "components/PostDetail/CommentCard";
import CommentSection from "components/PostDetail/CommentSection";
import Icon from "components/shared/Icon";
import Loading from "components/shared/Loading";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { commentDetailAsync } from "store/slices/commentDetailSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

interface CommentParams {
    commentId: string;
}

const Comment = () => {
    const { commentId } = useParams<CommentParams>();

    const dispatch = useAppDispatch();
    const commentDetailState = useAppSelector((state) => state.commentDetail);

    useEffect(() => {
        if (commentId) {
            dispatch(commentDetailAsync(commentId));
        }
    }, [commentId]);

    console.log(commentDetailState);
    return (
        <PageWrapper>
            <div className="lg:hidden flex justify-between items-center p-4">
                <div className="text-2xl">Discover</div>
                <Link to="/discover/search">
                    <Icon
                        className="text-2xl text-[color:var(--teal-lighter-color)]"
                        icon="search"
                    />
                </Link>
            </div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:mt-4">
                {/* Left */}
                <div className="w-full lg:col-span-2">
                    {commentDetailState?.status !== "idle" ? (
                        ""
                    ) : (
                        <CommentCard comment={commentDetailState?.data} />
                    )}
                    <CommentSection
                        key={commentId}
                        postId={commentId}
                        isPostChild={false}
                    />
                </div>
                {/* Right */}
                <div className="hidden col-span-1 lg:block"></div>
            </div>
        </PageWrapper>
    );
};

export default Comment;
