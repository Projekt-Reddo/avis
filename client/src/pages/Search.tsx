import React, { useEffect, useState } from "react";
import ThemeSearch from "../components/Home/ThemeSearch";
import TopSearch from "../components/Home/TopSearch";
import FeatureSearch from "../components/Home/FeatureSearch";
import PageWrapper from "components/shared/PageWrapper";
import { useAppDispatch } from "utils/react-redux-hooks";

const Search = () => {

    const dispatch = useAppDispatch();

    const [search,setSearch] = useState("");

    // useEffect(() => {
    //     dispatch(
    //         searchSongAsync({
    //             search: "",
    //             hum: null,
    //         })
    //     );
    // }, []);

    return (
    <PageWrapper>
        <div className="bg-white text-black">
            <div>
                <ThemeSearch setSearch={setSearch}/>
            </div>
            {search == null || search == "" ? (
                <div>

                </div>
            ) : (
                <div>
                    <TopSearch/>
                </div>
            )}
            <div>
                <FeatureSearch/>
            </div>
                <div className="bg-white h-12">
            </div>
        </div>
    </PageWrapper>
    );
};

export default Search;
