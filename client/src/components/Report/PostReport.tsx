import ModalForm from "components/Modal/ModalForm";
import { useModal } from "components/Modal/useModal";
import Icon from "components/shared/Icon";
import { FunctionComponent, useRef, useState } from "react";
import { useOutsideClick } from "utils/useOutsideClick";
import ReportForm from "./ReportForm";

interface PostReportProps {
    id: string;
}

const PostReport: FunctionComponent<PostReportProps> = ({ id }) => {
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
                    event.preventDefault();
                    setShowOptions(id);
                }}
            >
                <Icon
                    className="text-2xl cursor-pointer hover:text-[color:var(--teal-general-color)]"
                    icon="ellipsis"
                />
            </div>

            {showOptions && showOptions !== "" && (
                <button
                    ref={wrapperRef}
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        event.preventDefault();
                        setOpenReport(true);
                    }}
                    className="search-card font-bold top-0 right-0 absolute px-8 py-3 z-50 hover:bg-[color:var(--post-bg-hover-color)]"
                >
                    <Icon icon="flag" className="mr-4" />
                    Report Post
                </button>
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

export default PostReport;
