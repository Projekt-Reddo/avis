import Icon from "components/shared/Icon";
import * as React from "react";

interface FeatureSearchProp {}

const features = [
    {
        icon: "music",
        iconBgColor: "bg-rose-300",
        title: "Music",
        desc: "Music is one of the seven different forms of art that was born from the primeval age of human history. Throughout every person's life, everyone must have listened to music",
    },
    {
        icon: "users",
        iconBgColor: "bg-indigo-300",
        title: "Music is Sharing",
        desc: "A fundamental part of the enjoyment of music is that the enjoyment can be shared, just by sharing the music. Music is a way of sharing enjoyment (and more, deeper, feelings), and enjoyment is often shared through music",
    },
    {
        icon: "compact-disc",
        iconBgColor: "bg-lime-300",
        title: "Easy to Recall, Hard to Remember",
        desc: "People easy to recall the melody of the music they heard, but still they can't remember exactly the lyrics of the song due to many reasons",
    },
    {
        icon: "guitar",
        iconBgColor: "bg-amber-300",
        title: "Humming the Song",
        desc: "To solve that problem, we introduce our system called Hum2Song You can find your past Song just by Humming their melody",
    },
];

const FeatureSearch: React.FC<FeatureSearchProp> = () => {
    return (
        <div className="px-3 lg:px-32 2xl:px-52 mt-10 mb-4 lg:mb-10">
            <div className="text-2xl mb-2 text-black font-bold">Features</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {features.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-md shadow-md w-full p-1 border-[0.25px] sm:mt-5"
                    >
                        <div
                            className={`w-12 h-12 rounded-full ${item.iconBgColor} mt-7 mb-7 ml-3 flex items-center justify-center`}
                        >
                            <Icon
                                icon={item.icon}
                                className="w-5 text-[color:var(--white-color)]"
                                size="lg"
                            ></Icon>
                        </div>
                        <div className="font-bold ml-3 mb-2">{item.title}</div>
                        <div className="text-sm ml-3 mr-8 mb-5">
                            {item.desc}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureSearch;
