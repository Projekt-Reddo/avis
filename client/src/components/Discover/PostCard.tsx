// Libs
import React from "react";
import { IonButton, IonInput } from "@ionic/react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import axios from "axios";

// Components
import Icon from "components/shared/Icon";
// Constants
import { MAIN_SERVICE_API } from "utils/constants";

import Ayame from "static/Ayame.png";

// Style
import "theme/Discover.css";

interface PostCardProps {}

interface Post {
    Content: string;
    Images?: string[];
    Audios?: string;
    Videos?: string;
    Tags?: string[];
    UserId: string;
}

const PostCard: React.FC<PostCardProps> = () => {
    const { control, handleSubmit } = useForm<Post>();

    const createPostMutation = useMutation(async (newPost: Post) => {
        const { data } = await axios({
            method: "post",
            url: `${MAIN_SERVICE_API}/api/Post`,
            data: newPost,
        });
    });

    const handlePost = async (newPost: Post) => {
        newPost.UserId = "999999999999999999999999";

        createPostMutation.mutate(newPost);
    };

    return (
        <div className="card grid grid-cols-5 gap-4 mb-6 p-4">
            {/* Avatar */}
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
                <Controller
                    control={control}
                    name="Content"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <IonInput
                            className="col-span-4 border-b-2 text-base md:text-2xl h-12 md:h-20 mb-4"
                            placeholder="What's happening?"
                            onIonChange={onChange}
                            value={value}
                            onBlur={onBlur}
                        />
                    )}
                />

                <div className="flex justify-between m-0">
                    <div className="flex items-center">
                        <label htmlFor="audio-file">
                            <Icon className="post-icon" icon="file-audio" />
                        </label>
                        <input
                            id="audio-file"
                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                            type="file"
                            hidden
                        />
                        <label htmlFor="emoji">
                            <Icon
                                className="post-icon mx-7"
                                icon="face-smile"
                            />
                        </label>
                        <div id="emoji" />
                        <label htmlFor="calendar">
                            <Icon className="post-icon" icon="calendar-days" />
                        </label>
                        <div id="calendar" />
                    </div>
                    <IonButton
                        className="btnPost"
                        onClick={handleSubmit(handlePost)}
                    >
                        Post
                    </IonButton>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
