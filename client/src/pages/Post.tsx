import PostCard from "components/Post/PostCard";
import RightComponent from "components/Discover/RightComponent";
import PageWrapper from "components/PageWrapper/PageWrapper";
import CommentSection from "components/Comment/CommentSection";
import Icon from "components/shared/Icon";
import Loading from "components/shared/Loading";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { postDetailAsync } from "store/slices/postSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import NotFound from "components/shared/NotFound";

interface CommentParams {
    postId: string;
}
const Post = () => {
    const { postId } = useParams<CommentParams>();
    const dispatch = useAppDispatch();
    const postState = useAppSelector((state) => state.post);

    useEffect(() => {
        if (postId) {
            dispatch(postDetailAsync(postId));
        }
    }, [postId]);

    return (
        <PageWrapper>
            <div
                className="lg:hidden flex justify-between items-center p-4"
                data-cy="post-detail-wrapper"
            >
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
                    {postState.status === "loading" ||
                    postState.status === "init" ? (
                        <div className="w-full grid place-items-center">
                            <Loading />
                        </div>
                    ) : postState.status === "error" ||
                      (postState.status === "idle" && !postState.data) ||
                      Object.hasOwn(postState.data, "payload") ? (
                        <div className="w-full grid place-items-center">
                            <NotFound />
                        </div>
                    ) : (
                        <>
                            <PostCard
                                post={postState.data}
                                isDetailPage={true}
                            />
                            <CommentSection
                                key={postId}
                                postId={postId}
                                isPostChild={true}
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

export default Post;
