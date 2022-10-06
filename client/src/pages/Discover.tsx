// Libs
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

// Components
import PostCard from "components/Discover/PostCard";
import HumCard from "components/Discover/HumCard";
import TrendingCard from "components/Discover/TrendingCard";
import SearchBox from "components/Discover/SearchBox";

// Constants
import PageWrapper from "components/PageWrapper/PageWrapper";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { viewPostAsync } from "store/slices/postSlice";
import Loading from "components/shared/Loading";

interface pageFilterProps {
    currentPage: number;
    filter?: {
        content?: string;
        hashtags?: string[];
    };
}

const Discover = () => {
    const dispatch = useAppDispatch();

    const postState = useAppSelector((state) => state.post);

    const [pageFilter, setPageFilter] = React.useState<pageFilterProps>({
        currentPage: 1,
        filter: {},
    });

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
            filter: {
                content: data.content,
            },
        });
    };

    useEffect(() => {
        dispatch(
            viewPostAsync({
                page: pageFilter.currentPage,
                size: 10,
                filter: pageFilter.filter,
            })
        );
    }, [pageFilter]);

    return (
        <PageWrapper>
            <div className="flex justify-center lg:grid lg:grid-cols-3 lg:gap-6 mt-4">
                <div className="w-full lg:col-span-2">
                    <PostCard />
                    {postState.status === "loading" ||
                    !postState.data.payload ? (
                        // Loading Components
                        <div className="flex justify-center items-center mt-8">
                            <Loading />
                        </div>
                    ) : postState.status === "error" ? (
                        // Error show
                        <div className="flex justify-center items-center mt-8 text-lg">
                            <div>{postState.status}</div>
                        </div>
                    ) : (
                        postState.data.payload.map((post: any) => (
                            <HumCard key={post.id} post={post} />
                        ))
                    )}
                </div>
                <div className="hidden col-span-1 lg:block">
                    <div className="sticky top-4">
                        <SearchBox
                            register={register("content")}
                            handleSubmit={handleSubmit(handleSearch)}
                        />
                        <TrendingCard setState={setPageFilter} />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Discover;
