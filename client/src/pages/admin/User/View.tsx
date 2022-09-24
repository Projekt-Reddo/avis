import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { setUser, viewUserAsync } from "store/slices/userSlice";

import moment from "moment";

// Components
import Icon from "components/shared/Icon";
import Table from "components/shared/Table";
import PageWrapper from "components/PageWrapper/PageWrapper";
import SelectRow from "components/shared/SelectRow";
import Pagination from "components/shared/Pagination";

import { FieldValues, useForm } from "react-hook-form";
import { DayFormat } from "utils/constants";
import { recommendGenreApi } from "api/genre-api";
import Loading from "components/shared/Loading";

const View = () =>
{
    
    const dispatch = useAppDispatch();

    const userState = useAppSelector((state) => state.user);

    const [currentPage, setCurrentPage] = React.useState(1);

    const [rowShow, setRowShow] = React.useState({
        value: 10,
        label: "10 rows",
    });

    const [isSelected, setIsSelected] = React.useState<boolean>(false);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            name: "",
            genres: [],
            createdStart: "",
            createdEnd: "",
            modifiedStart: "",
            modifiedEnd: "",
        },
    });

    useEffect(() => {
        dispatch(
            viewUserAsync({
                page: 1,
                size: 10,
                filter: {
                    name: "",
                    sort: "",
                    joinedStart: "1000-09-22T02:28:47.051Z",
                    joinedEnd: "2022-09-22T02:28:47.052Z",
                    isModerator: false,
                    isBanned: false,
                    isMuted: false
                },
            })
        );
    });

    return (
        <PageWrapper className="bg-[#F0F0F5]">
                <>
                    {/* Data Table */}
                    <Table
                        className=""
                        columns={[
                            "Avatar",
                            "Name",
                            "Joined Date",
                            "Role",
                            "Ban"
                        ]}
                        data={userState.tableData.payload}
                        hasSelectOption={true}
                        setDataState={(data) => dispatch(setUser(data))}
                        onRowClick={() => {
                            console.log("Clicked");
                        }}
                        setIsSelected={setIsSelected}
                    />

                    <div className="sm:flex sm:justify-between">
                        {/* Show rows select */}
                        <SelectRow state={rowShow} setState={setRowShow} />

                        {/* Pagination */}
                        <Pagination
                            totalRecords={userState.data.total}
                            currentPage={currentPage}
                            pageSize={rowShow.value}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
        </PageWrapper>
    );
}

export default View;
export const getUserData = (data: any) => {
    return data.payload.map((item: any) => ({
        id: item.id,
        avatar: (
            <div className="flex justify-center items-center">
                <div
                    style={{
                        backgroundImage: `url(${item.avatar})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "35px",
                        width: "35px",
                        borderRadius: "50%",
                        border: "2px solid white",
                        minWidth: "35px",
                    }}
                />
            </div>
        ),
        name: item.name,
        joinedDate: item.joinedDate,
        role: item.role,
        isBanned: item.isBanned,
    }));
};
