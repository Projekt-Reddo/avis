// Components
import PostCreate from "components/Discover/PostCreate";
import PageWrapper from "components/PageWrapper/PageWrapper";

// Constants
import { viewMorePostAsync, viewPostAsync } from "store/slices/postSlice";
import DiscoverHeader from "components/Discover/DiscoverHeader";
import createPostInfiniteScrollLayout from "components/InfiniteScroll/createPostInfiniteScrollLayout";

const Discover = () => {
    return (
        <PageWrapper>
            {createPostInfiniteScrollLayout({
                storeSelector: (state: RootState) => state.post,
                getInitDataAction: viewPostAsync,
                getMoreDataAction: viewMorePostAsync,
                Header: DiscoverHeader,
                LeftComponent: PostCreate,
            })}
        </PageWrapper>
    );
};

export default Discover;
