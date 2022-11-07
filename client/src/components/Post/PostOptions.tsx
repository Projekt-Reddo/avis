import ModalForm from "components/Modal/ModalForm";
import { useModal } from "components/Modal/useModal";
import Icon from "components/shared/Icon";
import { FunctionComponent, useRef, useState } from "react";
import { useOutsideClick } from "utils/useOutsideClick";
import ReportForm from "../Report/ReportForm";

interface PostOptionsProps {
    id: string;
}

const PostOptions: FunctionComponent<PostOptionsProps> = ({ id }) => {
    const [showOptions, setShowOptions] = useState<string>("");
    const { open: openReport, setOpen: setOpenReport } = useModal();

    const wrapperRef = useRef(null);
    useOutsideClick(wrapperRef, () => {
        setShowOptions("");
    });

    return (
        <>
            <div
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    setShowOptions(id);
                }}
            >
                <Icon
                    className="text-2xl cursor-pointer hover:text-[color:var(--teal-general-color)]"
                    icon="ellipsis"
                />
            </div>

            {showOptions && showOptions !== "" && (
                <div
                    ref={wrapperRef}
                    className="search-card flex flex-col py-1 font-bold top-0 right-0 absolute z-50 bg-[color:var(--element-bg-color-elevate-1)] border-[0.5px] border-[color:var(--border-color)]"
                >
                    <button
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            event.stopPropagation();
                            setOpenReport(true);
                        }}
                        className="px-8 py-3 hover:bg-[color:var(--element-bg-color-elevate-2)] "
                    >
                        <Icon icon="flag" className="mr-4" />
                        Report Post
                    </button>
                </div>
            )}

            <ModalForm
                open={openReport}
                setOpen={setOpenReport}
                title="Report"
                modalBody={
                    <ReportForm id={id} isPost setOpenReport={setOpenReport} />
                }
                hasFooter={false}
            />
        </>
    );
};

export default PostOptions;
