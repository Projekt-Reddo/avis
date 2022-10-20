import PageWrapper from "components/PageWrapper/PageWrapper";
import CommentSection from "components/PostDetail/CommentSection";
import HumCardDetail from "components/PostDetail/HumCardDetail";
import Icon from "components/shared/Icon";
import React from "react";
import { Link, useParams } from "react-router-dom";

interface CommentParams {
    postId: string;
}
const Post = () => {
    const { postId } = useParams<CommentParams>();
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
                    <HumCardDetail />
                    <CommentSection postId={postId} isPostChild={true} />
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
