import Button from "components/Button/Button";
import { useModal } from "components/Modal";
import Modal from "components/Modal/Modal";
import { FunctionComponent } from "react";
import { confirmAsync } from "store/slices/reportSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

interface ReportConfirmProps {
    isSelected: boolean;
    isAccepted: boolean;
    filter: ReportFilterState;
}

const ReportConfirm: FunctionComponent<ReportConfirmProps> = ({
    isSelected,
    isAccepted,
    filter,
}) => {
    const dispatch = useAppDispatch();
    const reportState = useAppSelector((state) => state.report);
    const { open: openDelete, setOpen: setOpenDelete } = useModal();

    const handleConfirm = () => {
        dispatch(
            confirmAsync({
                isAccepted: isAccepted,
                filter: filter,
                ids: reportState.tableData
                    .filter((s: any) => s.isSelected == true)
                    .map((song: any) => song.id),
            })
        );
    };

    return (
        <>
            <Button
                className="none-shadow-button focus:outline-none mt-2"
                type="button"
                variant={isAccepted ? "primary" : "danger"}
                onClick={() => setOpenDelete(true)}
                disabled={isSelected ? false : true}
            >
                {isAccepted ? "Accept" : "Reject"}
            </Button>

            <Modal
                type={isAccepted ? "info" : "error"}
                open={openDelete}
                setOpen={setOpenDelete}
                title={isAccepted ? "Accept report(s)" : "Reject report(s)"}
                message={
                    isAccepted
                        ? "Selected report(s) will be accepted!"
                        : "Selected report(s) will be rejected!"
                }
                modalBody={<div className="w-full"></div>}
                confirmTitle="Confirm"
                onConfirm={handleConfirm}
            />
        </>
    );
};

export default ReportConfirm;
