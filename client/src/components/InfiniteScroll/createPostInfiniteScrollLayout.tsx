import React, { useEffect } from "react";
import "./InfiniteScroll.css";

// Logic
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { useWindowDimensions } from "utils/useWindowDimensions";

// Components
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "components/Post/PostCard";
import Loading from "components/shared/Loading";
import RightComponent from "components/Discover/RightComponent";

// Types
import { AsyncThunkAction } from "@reduxjs/toolkit";

interface PostInfiniteScrollLayoutProps {
    storeSelector: (state: RootState) => AsyncReducerInitialState;
    getInitDataAction: (arg: any) => AsyncThunkAction<any, any, {}>;
    getMoreDataAction: (arg: any) => AsyncThunkAction<any, any, {}>;
    Header?: React.FC<any>;
    LeftComponent: React.FC<any>;
    PageFilter: PageFilterProps;
}

export default function createPostInfiniteScrollLayout({
    storeSelector,
    getInitDataAction,
    getMoreDataAction,
    Header,
    LeftComponent,
    PageFilter,
}: PostInfiniteScrollLayoutProps) {
    const dispatch = useAppDispatch();

    const dataState = useAppSelector(storeSelector);

    const { width, height } = useWindowDimensions();

    const [fetchMorePage, setFetchMorePage] = React.useState(2);

    const fetchData = () => {
        dispatch(
            getMoreDataAction({
                page: fetchMorePage,
                size: PageFilter.rowShow,
                filter: PageFilter.filter,
            })
        );
        setFetchMorePage(fetchMorePage + 1);
    };

    useEffect(() => {
        dispatch(
            getInitDataAction({
                page: PageFilter.currentPage,
                size: PageFilter.rowShow,
                filter: PageFilter.filter,
            })
        );
    }, [PageFilter]);

    return (
        <>
            {Header && <Header />}
            <div className="lg:grid lg:grid-cols-3 lg:gap-6">
                {/* Left */}
                <div
                    className="w-full lg:col-span-2 page-wrapper scrollable-div"
                    id="scrollableDiv"
                >
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
                            scrollableTarget="scrollableDiv"
                            // className="page-wrapper"
                            // style={{
                            //     margin: "0 -1rem",
                            //     padding: "0 1rem",
                            //     minHeight: "100vh",
                            //     position: "absolute",
                            // }}
                            // height={
                            //     width! > MOBILE_BREAKPOINT
                            //         ? height! - 80
                            //         : height! - 128
                            // }
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
                                <div className="lg:pt-4">
                                    {dataState.data?.payload?.map(
                                        (post: Post) => (
                                            <PostCard
                                                key={post.id}
                                                post={post}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </InfiniteScroll>
                    )}
                </div>

                {/* Right */}
                <div className="hidden col-span-1 lg:block lg:mt-4">
                    <div className="sticky top-4">
                        <RightComponent />
                    </div>
                </div>
            </div>
        </>
    );
}
