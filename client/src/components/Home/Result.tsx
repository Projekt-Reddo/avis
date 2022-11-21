import Loading from "components/shared/Loading";
import * as React from "react";
import "theme/Result.css";
import Icon from "components/shared/Icon";
import { useHistory } from "react-router-dom";

interface ResultProp {
    result: {
        status: StateStatus;
        data: {
            payload: Song[];
        };
    };
    title?: string;
}

const Result: React.FC<ResultProp> = ({ result, title }) => {
    const audioRef = React.useRef(new Audio());
    const [songPlay, setSong] = React.useState("");
    const [isPlay, setPlay] = React.useState(false);
    let history = useHistory();

    const handlePausePlayClick = (e: string) => {
        audioRef.current.volume = 0.1;
        audioRef.current.currentTime = 0;
        if (e != audioRef.current.src) {
            audioRef.current.src = e;
            setSong(audioRef.current.src);
            setPlay(true);
            audioRef.current.play();
        } else {
            if (isPlay) {
                audioRef.current.pause();
                setPlay(false);
            } else {
                audioRef.current.play();
                setPlay(true);
            }
        }
    };

    if (result.status === "loading")
        return (
            <div className={`px-3 lg:px-32 2xl:px-52 py-5 lg:pb-0`}>
                <div className="text-2xl mb-3 text-[color:var(--text-primary-color)] font-bold">
                    {title ? title : "Top Result"}
                </div>
                <div className="px-3 lg:px-32 2xl:px-52 mt-10 h-48 flex justify-center items-center">
                    <Loading />
                </div>
            </div>
        );

    if (!result.data.payload) return <></>;

    return (
        <div className={`px-3 lg:px-32 2xl:px-52 py-5 lg:pb-0`}>
            <div className="text-2xl mb-3 text-[color:var(--text-primary-color)] font-bold">
                {title ? title : "Top Result"}
            </div>
            {result.data.payload.length <= 0 ? (
                <div className="h-24" data-cy="error-text-search">
                    No song found!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {result.data.payload.map((song) => (
                        <div
                            key={song.id}
                            className="flex flex-row rounded-md mb-6 bg-[color:var(--element-bg-color)] shadow-md col-span-1 cursor-pointer"
                            onClick={() => {
                                history.push(`/song/${song.id}`);
                            }}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent parent click
                                    handlePausePlayClick(
                                        song.url?.internal
                                            ? song.url?.internal
                                            : ""
                                    );
                                }}
                                className="Container rounded-md min-h-[11rem] flex justify-center items-center"
                                style={{
                                    backgroundImage: `url(${song.thumbnail})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "33%",
                                    maxWidth: "33%",
                                    minWidth: "33%",
                                }}
                            >
                                <div className="Icon">
                                    <div className="bg-[color:var(--inline-color)] h-[4rem] w-[4rem] rounded-full flex justify-center items-center">
                                        {songPlay == song.url?.internal ? (
                                            isPlay ? (
                                                <Icon
                                                    icon="pause"
                                                    className="fa-2xl text-[color:var(--white-color)]"
                                                />
                                            ) : (
                                                <Icon
                                                    icon="play"
                                                    className="fa-2xl text-[color:var(--white-color)]"
                                                />
                                            )
                                        ) : (
                                            <Icon
                                                icon="play"
                                                className="fa-2xl text-[color:var(--white-color)]"
                                            />
                                        )}
                                    </div>
                                    <audio
                                        ref={audioRef}
                                        onEnded={() => setSong("")}
                                    />
                                </div>
                            </div>
                            <div className="p-3">
                                <div
                                    className="text-xl font-bold"
                                    data-cy="text-search-result-item-title"
                                >
                                    {song.title}
                                </div>
                                <div>
                                    {song.artists &&
                                        song.artists.map((artist, index) =>
                                            index === song.artists.length - 1
                                                ? artist.name
                                                : artist.name + ", "
                                        )}
                                </div>
                                <div>
                                    {song.genres && song.genres.join(", ")}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Result;
