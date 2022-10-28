// Libs
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useLocation } from "react-router-dom";

// Components
import PostCard from "components/Discover/PostCard";
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

interface paramProps {
    content?: string;
    hashtags?: string[];
    isTrending?: boolean;
}

const Search = () => {
    const location = useLocation<paramProps>();

    const dispatch = useAppDispatch();

    const postState = useAppSelector((state) => state.post);

    const { width, height } = useWindowDimensions();

    const [pageFilter, setPageFilter] = React.useState<pageFilterProps>({
        currentPage: 1,
        rowShow: 10,
        filter: location.state,
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
            <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:mt-4 ">
                {/* Right */}
                <div className="flex items-center p-4 lg:block lg:col-span-1 lg:items-start lg:p-0 order-2">
                    <Link
                        to="/discover"
                        className="circle flex justify-center items-center mr-4 lg:hidden"
                    >
                        <Icon className="text-lg" icon="arrow-left" />
                    </Link>
                    <SearchBox
                        content={pageFilter.filter?.content}
                        register={register("content")}
                        handleSubmit={handleSubmit(handleSearch)}
                    />
                    <div className="hidden lg:block">
                        <TrendingCard
                            setFetchMorePage={setFetchMorePage}
                            setState={setPageFilter}
                        />
                    </div>
                </div>

                {/* Left */}
                <div className="col-span-2 w-full order-1">
                    {postState.status === "loading" ||
                    !postState.data.payload ? (
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
                                postState.data.total -
                                    postState.data.payload.length >
                                0
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
                            <div className="lg:hidden">
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
                                    <PostCard key={post.id} post={post} />
                                ))
                            )}
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Search;
