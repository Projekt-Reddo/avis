import { useEffect } from "react";
import { recommendHashtagAsync } from "store/slices/hashtagSlice";
import "theme/Discover.css";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

interface TrendingCardProps {
    setState: any;
    setFetchMorePage: any;
}

const TrendingCard: React.FC<TrendingCardProps> = ({
    setState,
    setFetchMorePage,
}) => {
    const dispatch = useAppDispatch();

    const hashtagState = useAppSelector((state) => state.hashtag.data);

    useEffect(() => {
        dispatch(recommendHashtagAsync());
    }, []);

    return (
        <>
            <div className="card drop-shadow-md lg:mt-4">
                <div className="text-xl bold mb-2 px-4 pt-2">
                    Trending for you
                </div>

                <div>
                    {hashtagState?.popular ? (
                        <div
                            onClick={() => {
                                setFetchMorePage(2);

                                setState((state: any) => ({
                                    ...state,
                                    currentPage: 1,
                                    filter: {
                                        hashtags: [hashtagState.popular],
                                    },
                                }));
                            }}
                            className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                        >
                            Popular
                        </div>
                    ) : (
                        ""
                    )}

                    {hashtagState?.randomHashtags.length > 0 ? (
                        <div
                            onClick={() => {
                                setFetchMorePage(2);

                                setState((state: any) => ({
                                    ...state,
                                    currentPage: 1,
                                    filter: {
                                        isTrending: true,
                                    },
                                }));
                            }}
                            className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                        >
                            Hot
                        </div>
                    ) : (
                        ""
                    )}

                    <div
                        onClick={() => {
                            setFetchMorePage(2);

                            setState((state: any) => ({
                                ...state,
                                currentPage: 1,
                                filter: {},
                            }));
                        }}
                        className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                    >
                        New
                    </div>

                    <div className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2">
                        Your Favorite
                    </div>

                    {hashtagState?.randomHashtags.length > 0 ? (
                        <div
                            onClick={() => {
                                setFetchMorePage(2);

                                setState((state: any) => ({
                                    ...state,
                                    currentPage: 1,
                                    filter: {
                                        hashtags: [
                                            hashtagState.randomHashtags[
                                                Math.floor(
                                                    Math.random() *
                                                        hashtagState
                                                            .randomHashtags
                                                            .length
                                                )
                                            ],
                                        ],
                                    },
                                }));
                            }}
                            className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                        >
                            Random
                        </div>
                    ) : (
                        ""
                    )}

                    {hashtagState?.randomHashtags
                        .slice(0, 3)
                        .map((hashtag: string) => (
                            <div
                                key={hashtag}
                                onClick={() => {
                                    setFetchMorePage(2);

                                    setState((state: any) => ({
                                        ...state,
                                        currentPage: 1,
                                        filter: {
                                            hashtags: [hashtag],
                                        },
                                    }));
                                }}
                                className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                            >
                                #{hashtag}
                            </div>
                        ))}
                </div>
            </div>

            <div className="hidden lg:block card mt-4 p-4">
                <div className="grid grid-cols-2">
                    <div>Help</div>

                    <div>
                        <div>About</div>
                        <div>Terms</div>
                        <div>Privacy Policy</div>
                    </div>
                </div>
                <div className="mt-4">@ Reddo Team 2022</div>
            </div>
        </>
    );
};

export default TrendingCard;
