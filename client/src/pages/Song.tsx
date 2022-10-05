import Footer from "components/Home/Footer";
import PageWrapper from "components/PageWrapper/PageWrapper";
import SongDetail from "components/Song/SongDetail";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { songDetailAsync } from "store/slices/songSlice";
import { relatedSongsAsync } from "store/slices/recommendSlice";
import { useEffect, useRef } from "react";
import Result from "components/Home/Result";

interface RouteParams {
    songId: string;
}

const Song = () => {
    const { songId } = useParams<RouteParams>();

    const topRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const songState = useAppSelector((state) => state.song);
    const relatedSongsState = useAppSelector((state) => state.recommend);

    useEffect(() => {
        if (songId) {
            dispatch(songDetailAsync(songId));
        }
    }, [songId]);

    useEffect(() => {
        if (songState.status === "idle") {
            dispatch(
                relatedSongsAsync({
                    genres: songState.data.genres,
                    existedId: songState.data.id,
                })
            );
            topRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
            });
        }
    }, [songState]);

    return (
        <PageWrapper
            style={{
                paddingLeft: 0,
                paddingRight: 0,
            }}
        >
            {/* <div className="w-full h-2" ref={topRef}></div> */}
            <div className="px-0 lg:px-32 2xl:px-52">
                <SongDetail songState={songState} />
            </div>
            <Result result={relatedSongsState} title="Related" />
            <Footer />
        </PageWrapper>
    );
};

export default Song;
