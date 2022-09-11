// Libs
import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import { useQuery } from "react-query";
import axios from "axios";

// Components
import PostCard from "../components/Discover/PostCard";
import HumCard from "../components/Discover/HumCard";
import TrendingCard from "../components/Discover/TrendingCard";
import SearchBox from "../components/Discover/SearchBox";

// Constants
import { MAIN_SERVICE_API } from "../utils/constants";

const Discover = () => {
    const { isLoading, isError, data, refetch } = useQuery(
        "boards",
        async () => {
            const { data } = await axios.get(`${MAIN_SERVICE_API}/api/post`);
            return data;
        },
        {
            enabled: false,
        }
    );

    React.useEffect(() => {
        refetch();
    }, []);

    return (
        <IonPage>
            <IonContent>
                <div className="flex justify-center lg:grid md:grid-cols-3 lg:gap-6 lg:m-16 pt-4">
                    <div className="w-full m-4 lg:m-0 lg:col-span-2">
                        <PostCard />
                        {isLoading || !data ? (
                            <div>Loading</div>
                        ) : isError ? (
                            <div>error</div>
                        ) : (
                            data.map((post: any, objIndex: any) => (
                                <div key={objIndex}>
                                    <HumCard post={post} />
                                </div>
                            ))
                        )}
                    </div>
                    <div className=" hidden lg:col-span-1 lg:block">
                        <SearchBox />
                        <TrendingCard />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Discover;
