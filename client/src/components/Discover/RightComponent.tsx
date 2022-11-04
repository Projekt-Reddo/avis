// Libs
import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { recommendHashtagAsync } from "store/slices/hashtagSlice";

// Components
import Icon from "components/shared/Icon";

interface RightComponentProps {}

const RightComponent: React.FC<RightComponentProps> = () => {
    const dispatch = useAppDispatch();

    const history = useHistory();

    const hashtagState = useAppSelector((state) => state.hashtag.data);

    const [content, setContent] = React.useState("");

    React.useEffect(() => {
        dispatch(recommendHashtagAsync());
    }, []);

    return (
        <>
            {/* Search Box */}
            <div className="search-card drop-shadow-md flex w-full">
                {/* Search Button */}
                <Link
                    to={{
                        pathname: "/search/discover",
                        state: {
                            content: content,
                        },
                    }}
                    className="flex justify-center items-center bg-[color:var(--element-bg-color)] py-2 px-4 focus:outline-none"
                    style={{
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                    }}
                >
                    <Icon
                        icon="search"
                        className="text-[color:var(--teal-lighter-color)]"
                    />
                </Link>

                {/* Search Input */}
                <input
                    className="w-full focus:outline-none bg-[color:var(--element-bg-color)] p-2"
                    style={{
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                    }}
                    placeholder="Search"
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        setContent(event.currentTarget.value);
                    }}
                    onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                        if (event.key === "Enter") {
                            history.push({
                                pathname: "/search/discover",
                                state: {
                                    currentPage: 1,
                                    content: content,
                                },
                            });
                        }
                    }}
                />
            </div>

            {/* Trending Card */}
            <div className="card drop-shadow-md lg:mt-4">
                <div className="text-xl bold mb-2 px-4 pt-2">
                    Trending for you
                </div>

                <div>
                    {hashtagState?.popular ? (
                        <div
                            className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                            onClick={() => {
                                history.push({
                                    pathname: "/search/discover",
                                    state: {
                                        hashtags: [hashtagState.popular],
                                    },
                                });
                            }}
                        >
                            Popular
                        </div>
                    ) : (
                        ""
                    )}

                    {hashtagState?.randomHashtags.length > 0 ? (
                        <div
                            className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                            onClick={() => {
                                history.push({
                                    pathname: "/search/discover",
                                    state: {
                                        isTrending: true,
                                    },
                                });
                            }}
                        >
                            Hot
                        </div>
                    ) : (
                        ""
                    )}

                    <div
                        className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                        onClick={() => {
                            history.push({
                                pathname: "/search/discover",
                                state: {},
                            });
                        }}
                    >
                        New
                    </div>

                    <div className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2">
                        Your Favorite
                    </div>

                    {hashtagState?.randomHashtags.length > 0 ? (
                        <div
                            className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                            onClick={() => {
                                history.push({
                                    pathname: "/search/discover",
                                    state: {
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
                                });
                            }}
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
                                className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2"
                                onClick={() => {
                                    history.push({
                                        pathname: "/search/discover",
                                        state: {
                                            hashtags: [hashtag],
                                        },
                                    });
                                }}
                            >
                                #{hashtag}
                            </div>
                        ))}
                </div>
            </div>

            <div className="hidden lg:block card drop-shadow-md mt-4 p-4">
                <div className="grid grid-cols-2">
                    <div>Help</div>

                    <div>
                        <div>About</div>
                        <div>Terms</div>
                        <div>Privacy Policy</div>
                    </div>
                </div>
                <div className="mt-2">@ Reddo Team 2022</div>
            </div>
        </>
    );
};

export default RightComponent;
