import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { setTableData, viewUserAsync } from "store/slices/userSlice";

// Components
import Table from "components/shared/Table";
import SelectRow from "components/shared/SelectRow";
import Pagination from "components/shared/Pagination";

import { FieldValues, useForm } from "react-hook-form";
import { DefaultDay, DefaultDay_2 } from "utils/constants";
import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";
import SearchFilter from "components/shared/SearchFilter";
import Icon from "components/shared/Icon";
import { sortListApi } from "api/account-api";
import UserPromoteButton from "components/Admin/User/UserPromoteButton";
import UserBanButton from "components/Admin/User/UserBanButton";
import Loading from "components/shared/Loading";
import UserMuteButton from "components/Admin/User/UserMuteButton";

const View = () => {
    const dispatch = useAppDispatch();

    const userState = useAppSelector((state) => state.user);

    const [pageRowFilter, setPageRowFilter] =
        React.useState<PageRowFilterProps>({
            currentPage: 1,
            rowShow: {
                value: 10,
                label: "10 rows",
            },
            filter: {
                name: "",
                sort: "",
                joinedStart: "1000-01-01T10:29:56.693Z",
                joinedEnd: "3000-01-01T10:29:56.693Z",
                isModerator: false,
                isBanned: false,
                isMuted: false,
            },
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
            sort: "",
            joinedStart: "",
            joinedEnd: "",
            isModerator: false,
            isBanned: false,
            isMuted: false,
        },
    });

    const handleSearch = (data: FieldValues) => {
        setPageRowFilter({
            currentPage: 1,
            rowShow: {
                value: pageRowFilter.rowShow.value,
                label: pageRowFilter.rowShow.label,
            },
            filter: {
                name: data.name,
                sort: data.sort,
                joinedStart:
                    data.joinedStart !== ""
                        ? data.joinedStart
                        : "1000-10-11T10:29:56.693Z",
                joinedEnd:
                    data.joinedEnd !== ""
                        ? data.joinedEnd
                        : "3000-10-11T10:29:56.693Z",
                isModerator: data.isModerator,
                isBanned: data.isBanned,
                isMuted: data.isMuted,
            },
        });
    };

    const filterContent = {
        selectMultiple: [
            {
                label: "Sort By",
                isMulti: false,
                loadOptionsCallback: sortListApi,
                control: control,
                controlName: "sort",
            },
        ],
        dateInput: [
            {
                label: "Joined Date",
                registerStart: register("joinedStart"),
                registerEnd: register("joinedEnd"),
            },
        ],
        radioBox: [
            {
                label: "Moderator",
                checkBox: register("isModerator"),
            },
            {
                label: "Banned",
                checkBox: register("isBanned"),
            },
            {
                label: "Muted",
                checkBox: register("isMuted"),
            },
        ],
    };

    useEffect(() => {
        dispatch(
            viewUserAsync({
                page: pageRowFilter.currentPage,
                size: pageRowFilter.rowShow.value,
                filter: {
                    name: pageRowFilter.filter?.name,
                    sort: pageRowFilter.filter?.sort,
                    joinedStart: pageRowFilter.filter?.joinedStart,
                    joinedEnd: pageRowFilter.filter?.joinedEnd,
                    isModerator: pageRowFilter.filter?.isModerator,
                    isBanned: pageRowFilter.filter?.isBanned,
                    isMuted: pageRowFilter.filter?.isMuted,
                },
            })
        );
    }, [pageRowFilter]);

    return (
        <PageWrapperWithLeftNav className="">
            <>
                {/* Header */}
                <div className="flex justify-between items-center pt-6">
                    <div className="text-lg font-bold">User</div>
                </div>
                {/* Search Bar */}
                <SearchFilter
                    placeholder="Enter name of user"
                    register={register("name")}
                    handleSubmit={handleSubmit(handleSearch)}
                    setValue={setValue}
                    filterContent={filterContent}
                />

                {userState.status === "loading" || !userState.tableData ? ( // Loading Components
                    <div className="flex justify-center items-center mt-8">
                        <Loading />
                    </div>
                ) : userState.status === "error" ? (
                    // Error show
                    <div className="flex justify-center items-center mt-8 text-lg">
                        <div>{userState.status}</div>
                    </div>
                ) : (
                    <>
                        {/* Manage Bar */}
                        <div className="flex justify-between items-center w-full">
                            <div className="flex flex-row items-center  w-full overflow-y-scroll">
                                <UserPromoteButton
                                    selectedUser={userState.tableData.filter(
                                        (user: UserDisplay) => user.isSelected
                                    )}
                                    setPageRowFilter={setPageRowFilter}
                                />
                                <UserBanButton
                                    selectedUser={userState.tableData.filter(
                                        (user: UserDisplay) => user.isSelected
                                    )}
                                    setPageRowFilter={setPageRowFilter}
                                />
                                <UserMuteButton
                                    selectedUser={userState.tableData.filter(
                                        (user: UserDisplay) => user.isSelected
                                    )}
                                    setPageRowFilter={setPageRowFilter}
                                />
                            </div>
                        </div>

                        {/* Data Table */}
                        <Table
                            className=""
                            columns={[
                                "Avatar",
                                "Name",
                                "Joined Date",
                                "Role",
                                "Is Banned",
                                "Post Mute Until",
                                "Comment Mute Until",
                            ]}
                            displayData={getUserData(userState.tableData)}
                            hasSelectOption={true}
                            setDataState={(data) =>
                                dispatch(setTableData(data))
                            }
                            rawData={userState.tableData}
                            setIsSelected={setIsSelected}
                        />

                        <div className="sm:flex sm:justify-between">
                            {/* Show rows select */}
                            <div>
                                {/* Show rows select */}
                                <SelectRow
                                    state={pageRowFilter.rowShow}
                                    setState={setPageRowFilter}
                                />
                            </div>

                            {/* Pagination */}
                            <Pagination
                                totalRecords={userState.data.total}
                                currentPage={pageRowFilter.currentPage}
                                pageSize={pageRowFilter.rowShow.value}
                                onPageChange={setPageRowFilter}
                            />
                        </div>
                    </>
                )}
            </>
        </PageWrapperWithLeftNav>
    );
};

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
        joinedDate: item.joinedDate.substring(0, 10),
        role: item.role,
        isBanned: !item.isBanned ? (
            <>
                <div className="w-10 h-10 rounded-full bg-[color:var(--teal-lighter-color)] flex items-center justify-center ml-5">
                    <Icon
                        icon="lock-open"
                        className="w-10 text-[color:var(--white-color)]"
                        size="xl"
                    />
                </div>
            </>
        ) : (
            <>
                <div className="w-10 h-10 rounded-full bg-[color:var(--red-darker-color)] flex items-center justify-center ml-5">
                    <Icon
                        icon="lock"
                        className="w-10 text-[color:var(--white-color)]"
                        size="xl"
                    />
                </div>
            </>
        ),
        postMutedUntil:
            item.postMutedUntil == DefaultDay ||
            item.postMutedUntil == DefaultDay_2
                ? "          "
                : item.postMutedUntil.substring(0, 10),
        commentMutedUntil:
            item.commentMutedUntil == DefaultDay ||
            item.commentMutedUntil == DefaultDay_2
                ? "          "
                : item.commentMutedUntil.substring(0, 10),
        isSelected: item.isSelected,
    }));
};
