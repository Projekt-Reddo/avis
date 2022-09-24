import Loading from "components/shared/Loading";
import * as React from "react";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";

interface TopSearchProp {
    result: {
        status: "idle" | "loading" | "error";
        data: {
            payload: Song[];
        };
    };
    scrollRef: React.RefObject<HTMLDivElement>;
}

const TopSearch: React.FC<TopSearchProp> = ({ result, scrollRef }) => {
    // For hiding nav bar in mobile view
    const { width } = useWindowDimensions();

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
                                className="rounded-md min-h-[11rem] w-1/3"
                                style={{
                                    backgroundImage: `url(${song.thumbnail})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></div>
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
