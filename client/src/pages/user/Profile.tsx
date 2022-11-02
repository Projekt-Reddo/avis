import React from "react";

import PageWrapper from "components/PageWrapper/PageWrapper";
import createPostInfiniteScrollLayout from "components/InfiniteScroll/createPostInfiniteScrollLayout";

import { viewMorePostAsync, viewPostAsync } from "store/slices/postSlice";
import ProfileCard from "components/Profile/ProfileCard";

const Profile = () => {
    return (
        <PageWrapper>
            {createPostInfiniteScrollLayout({
                storeSelector: (state: RootState) => state.post,
                getInitDataAction: viewPostAsync,
                getMoreDataAction: viewMorePostAsync,
                LeftComponent: ProfileCard,
            })}
        </PageWrapper>
    );
};

export default Profile;
