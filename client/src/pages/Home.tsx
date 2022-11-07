import SongSearch from "components/Home/SongSearch";
import Result from "components/Home/Result";
import Feature from "components/Home/Feature";
import Footer from "components/Home/Footer";
import { useAppSelector } from "utils/react-redux-hooks";
import "theme/Home.css";
import PageWrapper from "components/PageWrapper/PageWrapper";
import { useRef } from "react";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";

const Home = () => {
    const result = useAppSelector((state) => state.search);

    const scrollRef = useRef<HTMLDivElement>(null);

    const { width } = useWindowDimensions();

    return (
        <PageWrapper
            style={{
                paddingLeft: 0,
                paddingRight: 0,
            }}
        >
            <SongSearch scrollRef={scrollRef} />
            <div
                ref={scrollRef}
                className={`bg-[color:var(--bg-color)] text-[color:var(--text-primary-color)] h-auto ${
                    width! <= MOBILE_BREAKPOINT // Margin the fixed navbar when scrollIntoView
                        ? "scroll-mt-0"
                        : "scroll-mt-16"
                }`}
            >
                <Result result={result} />
            </div>
            <Feature />
            <Footer />
        </PageWrapper>
    );
};

export default Home;
