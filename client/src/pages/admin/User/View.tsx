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
import { DayFormat, DefaultDay, DefaultDay_2 } from "utils/constants";
import { recommendGenreApi } from "api/genre-api";
import Loading from "components/shared/Loading";
import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";

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
                    joinedStart: "2000-10-06T09:27:19.798Z",
                    joinedEnd: "2022-10-06T09:27:19.798Z",
                    isModerator: false,
                    isBanned: false,
                    isMuted: false
                },
            })
        );
    });

    return (
        <PageWrapperWithLeftNav className="bg-[#F0F0F5]">
                <>
                    {/* Data Table */}
                    <Table
                        className=""
                        columns={[
                            "Name",
                            "Avatar",
                            "Joined Date",
                            "Role",
                            "Is Banned",
                            "Post Mute Until",
                            "Comment Mute Until"
                        ]}
                        displayData={getUserData(userState.tableData)}
                        hasSelectOption={true}
                        setDataState={(data) => dispatch(setUser(data))}
                        rawData={userState.tableData}
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
        </PageWrapperWithLeftNav>
    );
}

export default View;
export const getUserData = (data: any) => {

    if (!data) return [];

    return data.map((item: any) => ({
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
        postMutedUntil: (item.postMutedUntil == DefaultDay || item.postMutedUntil == DefaultDay_2) ? "          " : item.postMutedUntil,
        commentMutedUntil: (item.commentMutedUntil == DefaultDay || item.commentMutedUntil == DefaultDay_2) ? "          " : item.commentMutedUntil
    }));
};
