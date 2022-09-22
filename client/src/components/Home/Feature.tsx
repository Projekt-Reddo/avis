import Icon from "components/shared/Icon";
import * as React from "react";

interface FeatureSearchProp {}

const FeatureSearch: React.FC<FeatureSearchProp> = () => {
    return (
        <div className="px-3 lg:px-32 2xl:px-52 mt-10">
            <div className="text-2xl mb-2 text-black font-bold">Features</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 justify-items-center">
                <div className="rounded shadow-xl max-w-[15rem] border-solid border-2 sm: mt-5">
                    <div className="w-12 h-12 rounded-full bg-rose-300 mt-7 mb-7 ml-3 flex items-center justify-center">
                        <Icon icon="music" className="w-5 text-[color:var(--white-color)]"></Icon>
                    </div>
                    <div className="font-bold ml-3 mb-2">Music</div>
                    <div className="text-xs ml-3 mr-8 mb-5">
                    Music is one of the seven different forms of art that was born from the primeval age of human history.
                    Throughout every person's life, everyone must have listened to music.
                    </div>
                </div>
                <div className="rounded shadow-xl max-w-[15rem] border-solid border-2 sm: mt-5">
                    <div className="w-12 h-12 rounded-full bg-indigo-300 mt-7 mb-7 ml-3 flex flex items-center justify-center">
                        <Icon icon="users" className="w-5 text-[color:var(--white-color)]"></Icon>
                    </div>
                    <div className="font-bold ml-3 mb-2">Music is Sharing</div>
                    <div className="text-xs ml-3 mr-8 mb-5">
                        A fundamental part of the enjoyment of music is that the enjoyment can be shared, just by sharing the music.
                        <br/>
                        Music is a way of sharing enjoyment (and more, deeper, feelings), and enjoyment is often shared through music.
                    </div>
                </div>
                <div className="rounded shadow-xl max-w-[15rem] border-solid border-2 sm: mt-5">
                    <div className="w-12 h-12 rounded-full bg-indigo-300 mt-7 mb-7 ml-3 flex flex items-center justify-center">
                        <Icon icon="compact-disc" className="w-5 text-[color:var(--white-color)]"></Icon>
                    </div>
                    <div className="font-bold ml-3 mb-2">Easy to Recall, Hard to Remember</div>
                    <div className="text-xs ml-3 mr-8 mb-5">
                        People easy to recall the melody of the music they heard,
                        but still they can't remember exactly the lyrics of the song due to many reasons
                    </div>
                </div>
                <div className="rounded shadow-xl max-w-[15rem] border-solid border-2 sm: mt-5">
                    <div className="w-12 h-12 rounded-full bg-indigo-300 mt-7 mb-7 ml-3 flex flex items-center justify-center">
                        <Icon icon="guitar" className="w-5 text-[color:var(--white-color)]"></Icon>
                    </div>
                    <div className="font-bold ml-3 mb-2">Humming the Song</div>
                    <div className="text-xs ml-3 mr-8 mb-5">
                        To solve that problem, we introduce our system called Hum2Song
                        <br/>
                        You can find your past Song just by Humming their melody
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSearch;
