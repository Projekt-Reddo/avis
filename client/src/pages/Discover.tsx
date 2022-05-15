// Libs
import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import { useQuery } from "react-query";
import axios from "axios";

// Components
import PostCard from "../components/PostCard";
import HumCard from "../components/HumCard";
import TrendingCard from "../components/TrendingCard";
import SearchBox from "../components/SearchBox";

// Constants
import { API } from "../utils/constants";

const Discover = () => {
    const { isLoading, isError, data, refetch } = useQuery(
        "boards",
        async () => {
            const { data } = await axios.get(`${API}/api/post`);
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
                <div className="flex justify-center lg:grid md:grid-cols-3 lg:gap-6 lg:m-16">
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
