import { deletePost } from "api/post-api";
import { useModal } from "components/Modal";
import Modal from "components/Modal/Modal";
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";
import { FunctionComponent } from "react";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { deletePost as deletePostStore } from "store/slices/postSlice";

interface PostDeleteButtonProps {
    post: Post;
}

const PostDeleteButton: FunctionComponent<PostDeleteButtonProps> = ({
    post,
}) => {
    const { open, setOpen } = useModal();
    const postData = useAppSelector((state) => state.post.data);
    const dispatch = useAppDispatch();

    const handleAccept = () => {
        deletePost(post.id)
            .then((res) => {
                if (res.status === 200) {
                    addNewToast({
                        variant: "primary",
                        message: res.message,
                    });
                    dispatch(
                        deletePostStore(
                            Object.hasOwn(postData, "payload")
                                ? {
                                      total: postData.total - 1,
                                      payload: postData.payload.filter(
                                          (x: Post) => x.id !== post.id
                                      ),
                                  }
                                : null
                        )
                    );
                } else {
                    addNewToast({
                        variant: "warning",
                        message: res.message,
                    });
                }
            })
            .catch((err) => {
                addNewToast({
                    variant: "warning",
                    message:
                        err.response?.data?.message || "Some error occured!",
                });
            });
    };

    return (
        <>
            <button
                onClick={() => {
                    setOpen(true);
                }}
                className="px-8 py-2 hover:bg-[color:var(--element-bg-color-elevate-1)] flex justify-between items-center"
            >
                <Icon icon="trash" className="mr-4" />
                Delete
            </button>

            <Modal
                open={open}
                setOpen={setOpen}
                title="Delete post"
                message="Are you sure you want to delete this post ?"
                type="warning"
                onConfirm={handleAccept}
            />
        </>
    );
};

export default PostDeleteButton;
