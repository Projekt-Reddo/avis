import RightComponent from "components/Discover/RightComponent";
import PageWrapper from "components/PageWrapper/PageWrapper";
import CommentCard from "components/Comment/CommentCard";
import CommentSection from "components/Comment/CommentSection";
import Icon from "components/shared/Icon";
import Loading from "components/shared/Loading";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { commentDetailAsync } from "store/slices/commentDetailSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import NotFound from "components/shared/NotFound";

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
                    {commentDetailState.status === "loading" ||
                    commentDetailState.status === "init" ? (
                        <div className="w-full grid place-items-center">
                            <Loading />
                        </div>
                    ) : commentDetailState.status === "error" ||
                      (commentDetailState.status === "idle" &&
                          !commentDetailState.data) ? (
                        <div className="w-full grid place-items-center">
                            <NotFound />
                        </div>
                    ) : (
                        <>
                            <div className="hum-card min-w-[20rem] p-4 lg:mb-4 border-t-0">
                                <CommentCard
                                    comment={commentDetailState?.data}
                                />
                            </div>

                            {/* It's child comments */}
                            <CommentSection
                                key={commentId}
                                postId={commentId}
                                isPostChild={false}
                            />
                        </>
                    )}
                </div>

                {/* Right */}
                <div className="hidden col-span-1 lg:block">
                    <div className="sticky top-4">
                        <RightComponent />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Comment;
