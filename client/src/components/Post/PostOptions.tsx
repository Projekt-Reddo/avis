import Modal from "components/Modal/Modal";
import ModalForm from "components/Modal/ModalForm";
import { useModal } from "components/Modal/useModal";
import Icon from "components/shared/Icon";
import { FunctionComponent, useRef, useState } from "react";
import { useAppSelector } from "utils/react-redux-hooks";
import { useOutsideClick } from "utils/useOutsideClick";
import ReportForm from "../Report/ReportForm";
import PostDeleteButton from "./PostDeleteButton";

interface PostOptionsProps {
    post: Post;
}

const PostOptions: FunctionComponent<PostOptionsProps> = ({ post }) => {
    const [showOptions, setShowOptions] = useState<string>("");
    const { open: openReport, setOpen: setOpenReport } = useModal();

    const authState = useAppSelector((state) => state.auth);

    const wrapperRef = useRef(null);
    useOutsideClick(wrapperRef, () => {
        // setShowOptions("");
    });

    return (
        <>
            <div
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    if (showOptions === "") {
                        setShowOptions(post.id);
                    } else setShowOptions("");
                }}
            >
                <Icon
                    className="text-2xl cursor-pointer hover:text-[color:var(--teal-general-color)]"
                    icon="ellipsis"
                />
            </div>

            {showOptions && showOptions !== "" && authState.status === "idle" && (
                <div
                    ref={wrapperRef}
                    className="search-card flex flex-col py-1 font-bold drop-shadow-md top-8 right-0 absolute z-50 bg-[color:var(--element-bg-color)] border-[0.5px] border-[color:var(--border-color)]"
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        event.stopPropagation();
                    }}
                >
                    <button
                        onClick={() => {
                            setOpenReport(true);
                        }}
                        className="px-8 py-2 hover:bg-[color:var(--element-bg-color-elevate-1)] flex justify-between items-center"
                    >
                        <Icon icon="flag" className="mr-4" />
                        Report
                    </button>
                    {authState.data.uid === post.user.id && (
                        <PostDeleteButton post={post} />
                    )}
                </div>
            )}

            <ModalForm
                open={openReport}
                setOpen={setOpenReport}
                title="Report"
                modalBody={
                    <ReportForm
                        id={post.id}
                        isPost
                        setOpenReport={setOpenReport}
                    />
                }
                hasFooter={false}
            />
        </>
    );
};

export default PostOptions;
