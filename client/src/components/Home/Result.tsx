import Loading from "components/shared/Loading";
import * as React from "react";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";
import "../../theme/Result.css";
import Icon from "components/shared/Icon";

interface TopSearchProp {
    result: {
        status: StateStatus;
        data: {
            payload: Song[];
        };
    };
    scrollRef: React.RefObject<HTMLDivElement>;
}

const TopSearch: React.FC<TopSearchProp> = ({ result, scrollRef }) => {
    // For hiding nav bar in mobile view
    const { width } = useWindowDimensions();

    const audioRef = React.useRef(new Audio());
    const [songPlay, setSong] = React.useState("");
    const [isPlay, setPlay] = React.useState(false);

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

    return (
        <div
            ref={scrollRef}
            className={`px-3 lg:px-32 2xl:px-52 mt-10 ${
                width! <= MOBILE_BREAKPOINT // Margin the fixed navbar when scrollIntoView
                    ? "scroll-mt-1"
                    : "scroll-mt-[4.5rem]"
            }`}
        >
            <div className="text-2xl mb-3 text-black font-bold">Top Result</div>
            {result.status === "loading" ? (
                <div className="px-3 lg:px-32 2xl:px-52 mt-10 h-48 flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {result.data.payload.map((song) => (
                        <div
                            key={song.id}
                            className="flex flex-row rounded-md mb-6 shadow-md col-span-1"
                        >
                            <div
                                onClick={() =>
                                    handlePausePlayClick(
                                        song.url?.internal
                                            ? song.url?.internal
                                            : ""
                                    )
                                }
                                className="Container rounded-md min-h-[11rem]  flex justify-center items-center"
                                style={{
                                    backgroundImage: `url(${song.thumbnail})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "33%",
                                    maxWidth: "33%",
                                    minWidth: "33%"
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
                            <div className="ml-3 mt-3">
                                <div className="text-xl font-bold">
                                    {song.title}
                                </div>
                                <div>
                                    {song.artists && song.artists.join(", ")}
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
export default TopSearch;
