// Libs
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

// Components
import HumCard from "components/Discover/HumCard";
import TrendingCard from "components/Discover/TrendingCard";
import SearchBox from "components/Discover/SearchBox";
import PageWrapper from "components/PageWrapper/PageWrapper";
import Loading from "components/shared/Loading";
import Icon from "components/shared/Icon";

// Constants
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { viewMorePostAsync, viewPostAsync } from "store/slices/postSlice";
import { useWindowDimensions } from "utils/useWindowDimensions";
import { MOBILE_BREAKPOINT } from "utils/constants";

interface pageFilterProps {
    currentPage: number;
    rowShow: number;
    filter?: {
        content?: string;
        hashtags?: string[];
        isTrending?: boolean;
    };
}

const Search = () => {
    const dispatch = useAppDispatch();

    const postState = useAppSelector((state) => state.post);

    const { width, height } = useWindowDimensions();

    const [pageFilter, setPageFilter] = React.useState<pageFilterProps>({
        currentPage: 1,
        rowShow: 10,
        filter: {},
    });

    const [fetchMorePage, setFetchMorePage] = React.useState(2);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            content: "",
            hashtags: [],
        },
    });

    const handleSearch = (data: FieldValues) => {
        setPageFilter({
            currentPage: 1,
            rowShow: pageFilter.rowShow,
            filter: {
                content: data.content,
            },
        });
        setFetchMorePage(2);
    };

    const fetchData = () => {
        dispatch(
            viewMorePostAsync({
                page: fetchMorePage,
                size: pageFilter.rowShow,
                filter: pageFilter.filter,
            })
        );
        setFetchMorePage(fetchMorePage + 1);
    };

    useEffect(() => {
        dispatch(
            viewPostAsync({
                page: pageFilter.currentPage,
                size: pageFilter.rowShow,
                filter: pageFilter.filter,
            })
        );
    }, [pageFilter]);

    return (
        <PageWrapper>
            <div className="flex items-center p-4">
                <Link
                    to="/discover"
                    className="circle flex justify-center items-center mr-4"
                >
                    <Icon className="text-lg" icon="arrow-left" />
                </Link>
                <SearchBox
                    register={register("content")}
                    handleSubmit={handleSubmit(handleSearch)}
                />
            </div>
            {postState.status === "loading" || !postState.data.payload ? (
                // Loading
                <div className="flex justify-center items-center mt-8">
                    <Loading />
                </div>
            ) : postState.status === "error" ? (
                // Error
                <div className="flex justify-center items-center mt-8 text-lg">
                    <div>{postState.status}</div>
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={postState.data.payload.length}
                    next={fetchData}
                    hasMore={
                        postState.data.total - postState.data.payload.length > 0
                    }
                    className="page-wrapper"
                    style={{
                        margin: "0 -1rem",
                        padding: "0 1rem",
                    }}
                    height={
                        width! > MOBILE_BREAKPOINT
                            ? height! - 137
                            : height! - 138
                    }
                    loader={
                        // Loading
                        <div className="flex justify-center items-center my-4">
                            <Loading />
                        </div>
                    }
                    endMessage={
                        <div className="flex justify-center items-center font-bold my-4">
                            Post to view more
                        </div>
                    }
                >
                    <div>
                        <TrendingCard
                            setFetchMorePage={setFetchMorePage}
                            setState={setPageFilter}
                        />
                    </div>

                    {postState.data.payload.length === 0 ? (
                        <div className="flex justify-center items-center font-bold my-4">
                            No result
                        </div>
                    ) : (
                        postState.data?.payload?.map((post: Post) => (
                            <HumCard key={post.id} post={post} />
                        ))
                    )}
                </InfiniteScroll>
            )}
        </PageWrapper>
    );
};

export default Search;
