// Components
import PostCard from "components/Discover/PostCard";
import PageWrapper from "components/PageWrapper/PageWrapper";

// Constants
import { viewMorePostAsync, viewPostAsync } from "store/slices/postSlice";
import DiscoverHeader from "components/Discover/DiscoverHeader";
import createPostInfiniteScrollLayout from "components/Posts/createPostInfiniteScrollLayout";

const Discover = () => {
    return (
        <PageWrapper>
            {createPostInfiniteScrollLayout({
                storeSelector: (state: RootState) => state.post,
                getInitDataAction: viewPostAsync,
                getMoreDataAction: viewMorePostAsync,
                Header: DiscoverHeader,
                LeftComponent: PostCard,
            })}
        </PageWrapper>
    );
};

export default Discover;
