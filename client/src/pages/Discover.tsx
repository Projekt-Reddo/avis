import React from "react";

// Components
import PostCreate from "components/Discover/PostCreate";
import PageWrapper from "components/PageWrapper/PageWrapper";

// Constants
import { viewMorePostAsync, viewPostAsync } from "store/slices/postSlice";
import DiscoverHeader from "components/Discover/DiscoverHeader";
import createPostInfiniteScrollLayout from "components/InfiniteScroll/createPostInfiniteScrollLayout";

const Discover = () => {
    const [pageFilter, setPageFilter] = React.useState<PageFilterProps>({
        currentPage: 1,
        rowShow: 10,
        filter: {},
    });

    return (
        <PageWrapper>
            {createPostInfiniteScrollLayout({
                storeSelector: (state: RootState) => state.post,
                getInitDataAction: viewPostAsync,
                getMoreDataAction: viewMorePostAsync,
                Header: DiscoverHeader,
                LeftComponent: PostCreate,
                PageFilter: pageFilter,
            })}
        </PageWrapper>
    );
};

export default Discover;
