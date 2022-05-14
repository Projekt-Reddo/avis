import Icon from "./shared/Icon";

import "./HumCard.css";

import Towa from "../static/Towa.png";
import AyaFubiMi from "static/AyaFubiMi.png";

interface HumCardProps {}

const HumCard: React.FC<HumCardProps> = () => {
    return (
        <div className="card grid grid-cols-5 gap-4 mb-6 p-4">
            <div className="col-span-1">
                <div className="flex justify-center mb-4">
                    <div
                        className="avatar"
                        style={{
                            backgroundImage: `url(${Towa})`,
                        }}
                    />
                </div>
                <div className="color-65 text-center">
                    <Icon className="text-5xl" icon="caret-up" />
                    <div className="color-75 text-4xl">10</div>
                    <Icon className="color-65 text-5xl" icon="caret-down" />
                </div>
            </div>

            <div className="col-span-4">
                <div className="flex justify-between">
                    <div className="flex">
                        <div>dbdbd9</div>
                        <div className="color-6 ml-4">Apr 29</div>
                    </div>
                    <Icon
                        icon="ellipsis"
                        style={{
                            fontSize: "1.5rem",
                            color: "rgba(0, 0, 0, 0.5)",
                        }}
                    />
                </div>
                <div className="my-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                </div>
                <div
                    className="hum-image-post"
                    style={{
                        backgroundImage: `url(${AyaFubiMi})`,
                    }}
                />
                <div />

                <div className="flex justify-between my-4">
                    <div className="flex">
                        <div className="flex">
                            <Icon className="icon-font-color" icon="message" />
                            <div className="color-75 ml-2">Comment</div>
                        </div>
                        <div className="flex mx-9">
                            <Icon className="icon-font-color" icon="share" />
                            <div className="color-75 first-letter:ml-2">
                                Share
                            </div>
                        </div>
                        <div className="flex">
                            <Icon className="icon-font-color" icon="bookmark" />
                            <div className="color-75 ml-2">Save</div>
                        </div>
                    </div>
                    <div>100% Upvoted</div>
                </div>
            </div>
        </div>
    );
};

export default HumCard;
