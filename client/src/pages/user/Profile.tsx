import React from "react";

import DiscoverHeader from "components/Discover/DiscoverHeader";
import PageWrapper from "components/PageWrapper/PageWrapper";
import createPostInfiniteScrollLayout from "components/Posts/createPostInfiniteScrollLayout";

import { viewMorePostAsync, viewPostAsync } from "store/slices/postSlice";
import ProfileCard from "components/Profile/ProfileCard";

const Profile = () => {
    return (
        <PageWrapper>
            {" "}
            {createPostInfiniteScrollLayout({
                storeSelector: (state: RootState) => state.post,
                getInitDataAction: viewPostAsync,
                getMoreDataAction: viewMorePostAsync,
                Header: DiscoverHeader,
                LeftComponent: ProfileCard,
            })}
        </PageWrapper>
    );
};

export default Profile;
