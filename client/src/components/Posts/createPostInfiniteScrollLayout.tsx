import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

// Logic
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { useWindowDimensions } from "utils/useWindowDimensions";

// Components
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "components/Discover/PostCard";
import SearchBox from "components/Discover/SearchBox";
import TrendingCard from "components/Discover/TrendingCard";
import Loading from "components/shared/Loading";

// Types
import { AsyncThunkAction } from "@reduxjs/toolkit";

interface PostInfiniteScrollLayoutProps {
    storeSelector: (state: RootState) => AsyncReducerInitialState;
    getInitDataAction: (arg: any) => AsyncThunkAction<any, any, {}>;
    getMoreDataAction: (arg: any) => AsyncThunkAction<any, any, {}>;
    Header?: React.FC<any>;
    LeftComponent: React.FC<any>;
}

export default function createPostInfiniteScrollLayout({
    storeSelector,
    getInitDataAction,
    getMoreDataAction,
    Header,
    LeftComponent,
}: PostInfiniteScrollLayoutProps) {
    const dispatch = useAppDispatch();

    const dataState = useAppSelector(storeSelector);

    const { width, height } = useWindowDimensions();

    const [pageFilter, setPageFilter] = React.useState<PageFilterProps>({
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
            getMoreDataAction({
                page: fetchMorePage,
                size: pageFilter.rowShow,
                filter: pageFilter.filter,
            })
        );
        setFetchMorePage(fetchMorePage + 1);
    };

    useEffect(() => {
        dispatch(
            getInitDataAction({
                page: pageFilter.currentPage,
                size: pageFilter.rowShow,
                filter: pageFilter.filter,
            })
        );
    }, [pageFilter]);

    return (
        <>
            {Header && <Header />}
            <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:mt-4">
                {/* Left */}
                <div className="w-full lg:col-span-2">
                    <LeftComponent loading={dataState.status === "loading"} />
                    {dataState.status === "loading" ||
                    !dataState.data.payload ? (
                        // Loading
                        <div className="flex justify-center items-center mt-8">
                            <Loading />
                        </div>
                    ) : dataState.status === "error" ? (
                        // Error
                        <div className="flex justify-center items-center mt-8 text-lg">
                            <div>{dataState.status}</div>
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={dataState.data.payload.length}
                            next={fetchData}
                            hasMore={
                                dataState.data.total -
                                    dataState.data.payload.length >
                                0
                            }
                            className="page-wrapper"
                            style={{
                                margin: "0 -1rem",
                                padding: "0 1rem",
                                minHeight: "100vh",
                            }}
                            height={
                                width! > MOBILE_BREAKPOINT
                                    ? height! - 80
                                    : height! - 128
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
                            {dataState.data.payload.length === 0 ? (
                                <div className="flex justify-center items-center font-bold my-4">
                                    No result
                                </div>
                            ) : (
                                dataState.data?.payload?.map((post: Post) => (
                                    <PostCard key={post.id} post={post} />
                                ))
                            )}
                        </InfiniteScroll>
                    )}
                </div>
                {/* Right */}
                <div className="hidden col-span-1 lg:block">
                    <SearchBox
                        register={register("content")}
                        handleSubmit={handleSubmit(handleSearch)}
                    />
                    <TrendingCard
                        setFetchMorePage={setFetchMorePage}
                        setState={setPageFilter}
                    />
                </div>
            </div>
        </>
    );
}
