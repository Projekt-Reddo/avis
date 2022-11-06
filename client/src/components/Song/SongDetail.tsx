import Icon from "components/shared/Icon";
import TextLoading from "components/SkeletonLoading/TextLoading";
import VideoLoading from "components/SkeletonLoading/VideoLoading";
import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

interface SongDetailProps {
    songState: {
        status: StateStatus;
        data: Song;
    };
}

const SongDetail: FunctionComponent<SongDetailProps> = ({ songState }) => {
    const audioRef = React.useRef(new Audio());
    const [isPlay, setIsPlay] = React.useState(false);

    const [loadingStatus, setLoadingStatus] = useState(true);

    useEffect(() => {
        if (songState.status !== "idle") {
            setLoadingStatus(true);
        } else {
            setLoadingStatus(false);
        }
    }, [songState]);

    const handlePausePlayClick = (e: string) => {
        audioRef.current.volume = 0.4;
        if (e != audioRef.current.src) {
            audioRef.current.src = e;
            setIsPlay(true);
            audioRef.current.play();
        } else {
            if (isPlay) {
                audioRef.current.pause();
                setIsPlay(false);
            } else {
                audioRef.current.play();
                setIsPlay(true);
            }
        }
    };

    return (
        <div className="lg:mt-48 mb-4 bg-[color:var(--body-bg-color)] lg:shadow-lg w-full h-fit grid grid-cols-3 rounded-lg border-[0.25px] border-[color:var(--border-color)]">
            <div className="col-span-full lg:col-span-1 flex flex-col lg:sticky top-[11rem] self-start">
                <div className="w-full relative">
                    {loadingStatus ? (
                        <VideoLoading className="shadow-lg rounded-lg lg:absolute lg:-translate-y-1/2 ml-auto mr-auto right-0 left-0" />
                    ) : (
                        <div
                            className="h-96 lg:h-80 w-full lg:w-80 lg:shadow-lg lg:rounded-lg lg:absolute lg:-translate-y-1/2 ml-auto mr-auto right-0 left-0 flex justify-center items-center"
                            style={{
                                backgroundImage: `url(${songState.data.thumbnail})`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                            onClick={() =>
                                handlePausePlayClick(
                                    songState.data.url?.internal
                                        ? songState.data.url?.internal
                                        : ""
                                )
                            }
                        >
                            <div className="bg-[color:var(--inline-color)] h-[4rem] w-[4rem] rounded-full flex justify-center items-center">
                                {isPlay ? (
                                    <Icon
                                        icon="pause"
                                        className="fa-2xl text-[color:var(--white-color)]"
                                    />
                                ) : (
                                    <Icon
                                        icon="play"
                                        className="fa-2xl text-[color:var(--white-color)]"
                                    />
                                )}
                            </div>
                            <audio
                                ref={audioRef}
                                onEnded={() => setIsPlay(false)}
                            />
                        </div>
                    )}
                </div>
                <div className="hidden lg:mt-44 w-full lg:flex flex-col justify-center items-center mb-4">
                    <p className="text-lg mb-3">Play on</p>
                    <div className="flex justify-between w-4/5 2xl:w-3/4">
                        {loadingStatus ? (
                            <>
                                <Icon icon={["fab", "youtube"]} size="2xl" />
                                <Icon icon={["fab", "spotify"]} size="2xl" />
                                <Icon icon={["fab", "soundcloud"]} size="2xl" />
                            </>
                        ) : (
                            <>
                                <Link
                                    to={{
                                        pathname: `${songState.data.url?.youtube}`,
                                    }}
                                    target="_blank"
                                    className={`${
                                        songState.data.url?.youtube
                                            ? ""
                                            : "cursor-default"
                                    }`}
                                    onClick={(e) => {
                                        if (!songState.data.url?.youtube) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <Icon
                                        icon={["fab", "youtube"]}
                                        size="2xl"
                                    />
                                </Link>
                                <Link
                                    to={{
                                        pathname: `${songState.data.url?.spotify}`,
                                    }}
                                    target="_blank"
                                    className={`${
                                        songState.data.url?.spotify
                                            ? ""
                                            : "cursor-default"
                                    }`}
                                    onClick={(e) => {
                                        if (!songState.data.url?.spotify) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <Icon
                                        icon={["fab", "spotify"]}
                                        size="2xl"
                                    />
                                </Link>
                                <Link
                                    to={{
                                        pathname: `${songState.data.url?.soundcloud}`,
                                    }}
                                    target="_blank"
                                    className={`${
                                        songState.data.url?.soundcloud
                                            ? ""
                                            : "cursor-default"
                                    }`}
                                    onClick={(e) => {
                                        if (!songState.data.url?.soundcloud) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <Icon
                                        icon={["fab", "soundcloud"]}
                                        size="2xl"
                                    />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-span-full lg:col-span-2 h-fit px-3">
                <div className="w-full relative">
                    <div className="mt-3 lg:mt-0 lg:absolute lg:-translate-y-[130%] ml-auto mr-auto">
                        {loadingStatus ? (
                            <TextLoading row={2} className="w-40" />
                        ) : (
                            <>
                                <p className="text-lg text-center lg:text-left">
                                    {songState.data.artists.map(
                                        (artist, index) =>
                                            index ===
                                            songState.data.artists.length - 1
                                                ? artist.name
                                                : artist.name + ", "
                                    )}
                                </p>
                                <p className="text-3xl text-center lg:text-left">
                                    {songState.data.title}
                                </p>
                            </>
                        )}
                    </div>
                    <div className="py-4">
                        {loadingStatus ? (
                            <TextLoading row={20} />
                        ) : (
                            <ReactMarkdown children={songState.data.lyrics} />
                        )}
                    </div>
                    <div className="lg:hidden py-4">
                        <div className="flex flex-col gap-y-4 items-center">
                            {loadingStatus ? (
                                <>
                                    <button className="w-4/5 shadow-md border-[0.25px] p-2 flex justify-between rounded">
                                        <span>Open Youtube</span>
                                        <Icon
                                            icon={["fab", "youtube"]}
                                            size="2xl"
                                        />
                                    </button>
                                    <button className="w-4/5 shadow-md border-[0.25px] p-2 flex justify-between rounded">
                                        <span>Open Spotify</span>
                                        <Icon
                                            icon={["fab", "spotify"]}
                                            size="2xl"
                                        />
                                    </button>
                                    <button className="w-4/5 shadow-md border-[0.25px] p-2 flex justify-between rounded">
                                        <span>Open SoundCloud</span>
                                        <Icon
                                            icon={["fab", "soundcloud"]}
                                            size="2xl"
                                        />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to={{
                                            pathname: `${songState.data.url?.youtube}`,
                                        }}
                                        target="_blank"
                                        className={`w-4/5 shadow border-[0.25px] p-2 flex justify-between rounded ${
                                            songState.data.url?.youtube
                                                ? ""
                                                : "cursor-default"
                                        }`}
                                        onClick={(e) => {
                                            if (!songState.data.url?.youtube) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <span>Open Youtube</span>
                                        <Icon
                                            icon={["fab", "youtube"]}
                                            size="2xl"
                                        />
                                    </Link>
                                    <Link
                                        to={{
                                            pathname: `${songState.data.url?.spotify}`,
                                        }}
                                        target="_blank"
                                        className={`w-4/5 shadow border-[0.25px] p-2 flex justify-between rounded ${
                                            songState.data.url?.spotify
                                                ? ""
                                                : "cursor-default"
                                        }`}
                                        onClick={(e) => {
                                            if (!songState.data.url?.spotify) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <span>Open Spotify</span>
                                        <Icon
                                            icon={["fab", "spotify"]}
                                            size="2xl"
                                        />
                                    </Link>
                                    <Link
                                        to={{
                                            pathname: `${songState.data.url?.soundcloud}`,
                                        }}
                                        target="_blank"
                                        className={`w-4/5 shadow border-[0.25px] p-2 flex justify-between rounded ${
                                            songState.data.url?.soundcloud
                                                ? ""
                                                : "cursor-default"
                                        }`}
                                        onClick={(e) => {
                                            if (
                                                !songState.data.url?.soundcloud
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <span>Open SoundCloud</span>
                                        <Icon
                                            icon={["fab", "soundcloud"]}
                                            size="2xl"
                                        />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongDetail;
