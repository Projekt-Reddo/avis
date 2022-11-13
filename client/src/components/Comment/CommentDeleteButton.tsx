import { deleteComment } from "api/comment-api";
import { useModal } from "components/Modal";
import Modal from "components/Modal/Modal";
import Icon from "components/shared/Icon";
import { addNewToast } from "components/Toast";
import { FunctionComponent } from "react";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { deleteComment as deleteCommentList } from "store/slices/commentSlice";
import { deleteCommentDetail } from "store/slices/commentDetailSlice";

interface CommentDeleteButtonProps {
    comment: Comment;
}

const CommentDeleteButton: FunctionComponent<CommentDeleteButtonProps> = ({
    comment,
}) => {
    const authState = useAppSelector((state) => state.auth.data);
    const { open, setOpen } = useModal();
    const commentData = useAppSelector((state) => state.comment.data);
    const commentDetail = useAppSelector((state) => state.commentDetail.data);
    const dispatch = useAppDispatch();

    const handleAccept = () => {
        deleteComment(comment.id)
            .then((res) => {
                if (res.status === 200) {
                    addNewToast({
                        variant: "primary",
                        message: res.message,
                    });
                    dispatch(
                        deleteCommentList({
                            total: commentData.total - 1,
                            payload: commentData.payload.filter(
                                (x: Post) => x.id !== comment.id
                            ),
                        })
                    );

                    if (commentDetail.id === comment.id) {
                        console.log("delte comment detail page");
                        dispatch(deleteCommentDetail(null));
                    }
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

    if (!authState) {
        return <></>;
    }

    if (authState && authState.uid !== comment.user.id) {
        return <></>;
    }

    return (
        <>
            <Icon
                icon="trash"
                className="cursor-pointer hover:text-[color:var(--teal-general-color)]"
                onClick={() => {
                    setOpen(true);
                }}
            />

            <Modal
                open={open}
                setOpen={setOpen}
                title="Delete comment"
                message="Are you sure you want to delete this comment ?"
                type="error"
                onConfirm={handleAccept}
            />
        </>
    );
};

export default CommentDeleteButton;
