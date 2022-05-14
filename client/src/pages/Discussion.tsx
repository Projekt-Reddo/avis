import { IonContent, IonPage } from "@ionic/react";

import PostCard from "../components/PostCard";
import HumCard from "../components/HumCard";
import TrendingCard from "../components/TrendingCard";
import SearchBox from "../components/SearchBox";
const Discussion = () => {
    return (
        <IonPage className="padding-nav">
            <IonContent>
                <div className="grid grid-cols-2 md:grid-cols-3 md:gap-6 m-4 md:m-16">
                    <div className="col-span-2">
                        <PostCard />
                        <HumCard />
                        <HumCard />
                        <HumCard />
                    </div>
                    <div className=" hidden md:col-span-1 md:block">
                        <SearchBox />
                        <TrendingCard />
                        <TrendingCard />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Discussion;
