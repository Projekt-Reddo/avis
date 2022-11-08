// Libs
import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "utils/react-redux-hooks";

// Components
import PageWrapper from "components/PageWrapper/PageWrapper";
import ProfileCard from "components/Profile/ProfileCard";
import {
    viewMoreUserPostAsync,
    viewUserPostAsync,
    viewMoreSavedPostAsync,
    viewSavedPostAsync
} from "store/slices/postSlice";
import createPostInfiniteScrollLayout from "components/InfiniteScroll/createPostInfiniteScrollLayout";

const Profile = () => {
    const params: any = useParams();

    const user = useAppSelector((state) => state.auth.data);

    const [pageFilter, setPageFilter] = React.useState<PageFilterProps>({
        currentPage: 1,
        rowShow: 10,
        filter:
            params && params.uid
                ? {
                      userId: params.uid,
                  }
                : {
                      userId: user.uid,
                  },
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

    // View User Saved Post
    //     <PageWrapper>
    //     {createPostInfiniteScrollLayout({
    //         storeSelector: (state: RootState) => state.post,
    //         getInitDataAction: viewSavedPostAsync,
    //         getMoreDataAction: viewMoreSavedPostAsync,
    //         LeftComponent: ProfileCard,
    //         PageFilter: pageFilter,
    //     })}
    // </PageWrapper>

export default Profile;
