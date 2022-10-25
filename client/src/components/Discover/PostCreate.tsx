// Libs
import React from "react";

// Components
import Icon from "components/shared/Icon";
import Button from "components/Button/Button";

// Constants
import Ayame from "static/Ayame.png";

// Style
import "theme/Discover.css";

interface PostCreateProps {
    loading: boolean;
}

const PostCreate: React.FC<PostCreateProps> = ({ loading }) => {
    return (
        <div className="card grid grid-cols-5 sm:grid-cols-10 gap-4 min-w-[20rem] p-4">
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

            <div className="col-span-4 sm:col-span-9">
                <textarea
                    className="focus:outline-none text-2xl h-12 sm:h-20 w-full border-b-2 mb-4"
                    style={{ backgroundColor: "white" }}
                    placeholder="How do do feel today?"
                    rows={3}
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
                            <input id="calendar" type="date" hidden />
                        </label>
                    </div>
                    <Button type="button" disabled={loading}>
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostCreate;
