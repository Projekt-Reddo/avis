// Libs
import React from "react";

// Components
import PageWrapper from "components/PageWrapper/PageWrapper";
import ProfileCard from "components/Profile/ProfileCard";
import {
    viewMoreSavedPostAsync,
    viewSavedPostAsync,
} from "store/slices/postSlice";
import createPostInfiniteScrollLayout from "components/InfiniteScroll/createPostInfiniteScrollLayout";

const ProfileSave = () => {
    const [pageFilter, setPageFilter] = React.useState<PageFilterProps>({
        currentPage: 1,
        rowShow: 10,
        filter: {},
    });

    return (
        <PageWrapper>
            {createPostInfiniteScrollLayout({
                storeSelector: (state: RootState) => state.post,
                getInitDataAction: viewSavedPostAsync,
                getMoreDataAction: viewMoreSavedPostAsync,
                LeftComponent: ProfileCard,
                PageFilter: pageFilter,
            })}
        </PageWrapper>
    );
};

export default ProfileSave;
