import Icon from "./Icon";

import "../theme/Discover.css";

import Towa from "../static/Towa.png";
import AyaFubiMi from "../static/AyaFubiMi.png";

interface HumCardProps {
    post: any;
}

const HumCard: React.FC<HumCardProps> = ({ post }) => {
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
                    <Icon className="vote-icon" icon="caret-up" />
                    <div className="color-75 text-base lg:text-2xl">
                        111111111
                    </div>
                    <Icon className="vote-icon" icon="caret-down" />
                </div>
            </div>

            <div className="col-span-4">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="font-bold">dbdbd9</div>
                        <div className="color-6 ml-4">Apr 29</div>
                    </div>
                    <Icon className="card-icon" icon="ellipsis" />
                    <div className="card absolute px-8 py-2">
                        <Icon icon="flag" /> Report
                    </div>
                </div>
                <div className="my-4">{post.content}</div>
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
                            <Icon className="card-icon" icon="message" />
                            <div className="sm:hidden">100000000</div>
                            <div className="color-75 ml-2 hidden sm:block">
                                100000000 Comment
                            </div>
                        </div>
                        <div className="flex mx-4 sm:mx-6">
                            <Icon className="card-icon" icon="share" />
                            <div className="color-75 ml-2 hidden sm:block">
                                Share
                            </div>
                        </div>
                        <div className="flex">
                            <Icon className="card-icon" icon="bookmark" />
                            <div className="color-75 ml-2 hidden sm:block">
                                Save
                            </div>
                        </div>
                    </div>
                    <div className="text-xs">100% Upvoted</div>
                </div>
            </div>
        </div>
    );
};

export default HumCard;
