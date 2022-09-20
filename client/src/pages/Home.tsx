import PageWrapper from "components/shared/PageWrapper";
import SongSearch from "components/Home/SongSearch";
import Result from "components/Home/Result";
import Feature from "components/Home/Feature";
import { useAppSelector } from "utils/react-redux-hooks";
import "theme/Home.css";

const Home = () => {
    const result = useAppSelector((state) => state.song);

    return (
        <PageWrapper
            className="px-0 lg:px-0 2xl:px-0"
            style={{
                paddingRight: "0px !important",
                paddingLeft: "0px !important",
            }}
        >
            <SongSearch />
            <div className="bg-white text-black">
                {result.status === "idle" &&
                result.data.payload.length === 0 ? (
                    <></>
                ) : (
                    <div>
                        <Result result={result} />
                    </div>
                )}
                <div>
                    <Feature />
                </div>
                <div className="bg-white h-12"></div>
            </div>
        </PageWrapper>
    );
};

export default Home;
