import { useAppSelector } from "utils/react-redux-hooks";

// Components
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";

// Constants

// Styles
import "theme/Discover.css";
import React from "react";
import { savePost } from "api/post-api";

interface SaveProps {
    post: Post;
}

const SavePost: React.FC<SaveProps> = ({post}) => {

    const authState = useAppSelector((state) => state.auth.data);

    const handleUnauthorize = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        addNewToast({
            variant: "warning",
            message: "Please login to use this function",
        });
    };

    const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        savePost(post.id).then(
            data => addNewToast({
                variant: "warning",
                message: data.message,
            })
        ).catch(
            e => addNewToast({
            variant: "warning",
            message: e.response.data.message
        }));
    };



    return(
        <>
            <div
                onClick={
                    authState ? handleSave : handleUnauthorize
                }
                className="flex cursor-pointer hover:text-[color:var(--teal-general-color)]"
            >
                <Icon className="text-2xl" icon="bookmark" />
                <div className="ml-1 hidden sm:block">Save</div>
            </div>
        </>
    )
}

 export default SavePost;