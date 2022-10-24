import PostCard from "components/Discover/PostCard";
import PageWrapper from "components/PageWrapper/PageWrapper";
import CommentSection from "components/PostDetail/CommentSection";
import Icon from "components/shared/Icon";
import Loading from "components/shared/Loading";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { postDetailAsync } from "store/slices/postSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

interface CommentParams {
    postId: string;
}
const Post = () => {
    const { postId } = useParams<CommentParams>();
    const dispatch = useAppDispatch();
    const postState = useAppSelector((state) => state.post);
    console.log("🚀 ~ file: Post.tsx ~ line 17 ~ Post ~ postState", postState);

    useEffect(() => {
        if (postId) {
            dispatch(postDetailAsync(postId));
        }
    }, [postId]);

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
                    {postState.status !== "idle" || !postState.data.id ? (
                        <div className="w-full grid place-items-center">
                            <Loading />
                        </div>
                    ) : (
                        <>
                            <PostCard
                                post={postState.data}
                                isDetailPage={true}
                            />
                            <CommentSection
                                postId={postId}
                                isPostChild={true}
                            />
                        </>
                    )}
                </div>
                {/* Right */}
                <div className="hidden col-span-1 lg:block">
                    {/* <SearchBox
            register={register("content")}
            handleSubmit={handleSubmit(handleSearch)}
          />
          <TrendingCard
            setFetchMorePage={setFetchMorePage}
            setState={setPageFilter}
          /> */}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Post;
