import { IonButton, IonInput } from "@ionic/react";

import Ayame from "../static/Ayame.png";

import "./HumCard.css";

interface PostCardProps {}

const PostCard: React.FC<PostCardProps> = () => {
    return (
        <div className="card grid grid-cols-5 gap-4 mb-6 p-4">
            <div className="col-span-1 flex justify-center ">
                <div
                    className="avatar"
                    style={{
                        backgroundImage: `url(${Ayame})`,
                    }}
                />
                <div />
            </div>

            <div className="col-span-4">
                <IonInput
                    className="col-span-4 border-b-2 mb-4 h-[6rem]"
                    placeholder="What's happening?"
                />
                <div className="flex justify-end m-0">
                    <IonButton
                        style={{
                            width: 114,
                            height: 40,
                            backgroundColor: "#1E9BF0",
                            borderRadius: 8,
                        }}
                    >
                        Post
                    </IonButton>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
