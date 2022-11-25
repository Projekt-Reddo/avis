// Libs
import React from "react";

// Components
import ProfileCard from "components/Profile/ProfileCard";
import {
    viewMoreSavedPostAsync,
    viewSavedPostAsync,
} from "store/slices/postSlice";
import createPostInfiniteScrollLayout from "components/InfiniteScroll/createPostInfiniteScrollLayout";
import PageWrapperUser from "components/PageWrapper/PageWrapperUser";

const ProfileSave = () => {
    const [pageFilter, setPageFilter] = React.useState<PageFilterProps>({
        currentPage: 1,
        rowShow: 10,
        filter: {},
    });

    return (
        <PageWrapperUser>
            {createPostInfiniteScrollLayout({
                storeSelector: (state: RootState) => state.post,
                getInitDataAction: viewSavedPostAsync,
                getMoreDataAction: viewMoreSavedPostAsync,
                LeftComponent: ProfileCard,
                PageFilter: pageFilter,
            })}
        </PageWrapperUser>
    );
};

export default ProfileSave;
