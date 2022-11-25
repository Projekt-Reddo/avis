// Libs
import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "utils/react-redux-hooks";

// Components
import ProfileCard from "components/Profile/ProfileCard";
import {
    viewMoreUserPostAsync,
    viewUserPostAsync,
} from "store/slices/postSlice";
import createPostInfiniteScrollLayout from "components/InfiniteScroll/createPostInfiniteScrollLayout";
import PageWrapperUser from "components/PageWrapper/PageWrapperUser";

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
        <PageWrapperUser>
            {createPostInfiniteScrollLayout({
                storeSelector: (state: RootState) => state.post,
                getInitDataAction: viewUserPostAsync,
                getMoreDataAction: viewMoreUserPostAsync,
                LeftComponent: ProfileCard,
                PageFilter: pageFilter,
            })}
        </PageWrapperUser>
    );
};

export default Profile;
