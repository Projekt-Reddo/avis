// Libs
import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "utils/react-redux-hooks";

// Components
import PageWrapper from "components/PageWrapper/PageWrapper";

import { viewMoreSavedPostAsync, viewSavedPostAsync } from "store/slices/postSlice";
import ProfileCard from "components/Profile/ProfileCard";
import {
    viewMoreUserPostAsync,
    viewUserPostAsync,
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
                getInitDataAction: viewUserPostAsync,
                getMoreDataAction: viewMoreUserPostAsync,
                LeftComponent: ProfileCard,
                PageFilter: pageFilter,
            })}
        </PageWrapper>
    );
};

export default Profile;
