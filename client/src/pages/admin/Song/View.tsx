import React, { useEffect } from "react";

// Libs
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import {
    deleteSongAsync,
    setTableData,
    viewSongAsync,
} from "store/slices/songSlice";
import { Link, useHistory } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import moment from "moment";

// Components
import Icon from "components/shared/Icon";
import Table from "components/shared/Table";
import SearchFilter from "components/shared/SearchFilter";
import SelectRow from "components/shared/SelectRow";
import Pagination from "components/shared/Pagination";
import Loading from "components/shared/Loading";
import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";
import Button from "components/Button/Button";

// Constants
import { DayFormat } from "utils/constants";

// Api
import { recommendGenreApi } from "api/genre-api";
import { useModal } from "components/Modal";
import Modal from "components/Modal/Modal";
import ViewHeader from "components/Admin/View/ViewHeader";

interface pageRowFilterProps {
    currentPage: number;
    rowShow: {
        value: number;
        label: string;
    };
    filter?: {
        title?: string;
        genres?: string[];
        createdStart?: string;
        createdEnd?: string;
        modifiedStart?: string;
        modifiedEnd?: string;
    };
}

const View = () => {
    const dispatch = useAppDispatch();

    const history = useHistory();

    const songState = useAppSelector((state) => state.song);

    const { open: openDelete, setOpen: setOpenDelete } = useModal();

    const [isSelected, setIsSelected] = React.useState<boolean>(false);

    const [pageRowFilter, setPageRowFilter] =
        React.useState<pageRowFilterProps>({
            currentPage: 1,
            rowShow: {
                value: 10,
                label: "10 rows",
            },
            filter: {},
        });

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
            genres: [],
            createdStart: "",
            createdEnd: "",
            modifiedStart: "",
            modifiedEnd: "",
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
                title: data.title,
                genres: data.genres.length > 0 ? data.genres : null,
                createdStart:
                    data.createdStart !== "" ? data.createdStart : null,
                createdEnd: data.createdEnd !== "" ? data.createdEnd : null,
                modifiedStart:
                    data.modifiedStart !== "" ? data.modifiedStart : null,
                modifiedEnd: data.modifiedEnd !== "" ? data.modifiedEnd : null,
            },
        });
    };

    const handleDelete = () => {
        setIsSelected(false);
        dispatch(
            deleteSongAsync({
                deleteObject: {
                    listId: songState.tableData
                        .filter((s: any) => s.isSelected == true)
                        .map((song: any) => song.id),
                },
                searchFilter: pageRowFilter,
            })
        );
    };

    useEffect(() => {
        dispatch(
            viewSongAsync({
                page: pageRowFilter.currentPage,
                size: pageRowFilter.rowShow.value,
                filter: pageRowFilter.filter,
            })
        );
    }, [pageRowFilter]);

    const filterContent = {
        selectMultiple: [
            {
                label: "Genre",
                isMulti: true,
                loadOptionsCallback: recommendGenreApi,
                control: control,
                controlName: "genres",
            },
        ],
        dateInput: [
            {
                label: "Created Date",
                registerStart: register("createdStart"),
                registerEnd: register("createdEnd"),
            },
            {
                label: "Modified Date",
                registerStart: register("modifiedStart"),
                registerEnd: register("modifiedEnd"),
            },
        ],
    };

    return (
        <PageWrapperWithLeftNav className="bg-[#F0F0F5]">
            {/* Header */}
            <ViewHeader title="Song" addButtonUrl="/admin/song/create" />

            {/* Search Bar */}
            <SearchFilter
                placeholder="Enter title of song"
                register={register("title")}
                handleSubmit={handleSubmit(handleSearch)}
                setValue={setValue}
                filterContent={filterContent}
            />

            <Button
                className="none-shadow-button focus:outline-none mt-2"
                type="button"
                variant="danger"
                onClick={() => setOpenDelete(true)}
                disabled={isSelected ? false : true}
            >
                <Icon icon="trash" className="mr-2" />
                Delete
            </Button>

            <Modal
                type="error"
                open={openDelete}
                setOpen={setOpenDelete}
                title="Delete Song"
                message="After you delete those songs, it's permanently deleted. Songs can't be undeleted."
                modalBody={
                    <div className="w-full">
                        <div className="text-sm mb-2 text-[color:var(--text-tertiary-color)]">
                            Song
                        </div>
                        {songState.tableData
                            ?.filter((s: any) => s.isSelected === true)
                            .map((song: any) => (
                                <div key={song.id} className="mt-1">
                                    {song.title}
                                </div>
                            ))}
                    </div>
                }
                confirmTitle="Delete"
                onConfirm={handleDelete}
            />

            {/* Data Table */}
            {songState.status === "loading" || !songState.tableData ? (
                // Loading Components
                <div className="flex justify-center items-center mt-8">
                    <Loading />
                </div>
            ) : songState.status === "error" ? (
                // Error show
                <div className="flex justify-center items-center mt-8 text-lg">
                    <div>{songState.status}</div>
                </div>
            ) : (
                <>
                    {/* Data Table */}
                    <Table
                        className=""
                        columns={[
                            "Thumbnail",
                            "Title",
                            "Artist",
                            "Created",
                            "Modified",
                        ]}
                        displayData={getSongData(songState.tableData)}
                        hasSelectOption={true}
                        setDataState={(data) => dispatch(setTableData(data))}
                        rawData={songState.tableData}
                        onRowClick={(obj) => {
                            history.push(`/admin/song/edit/${obj.id}`);
                        }}
                        setIsSelected={setIsSelected}
                    />

                    <div className="sm:flex sm:justify-between">
                        <div>
                            {/* Show rows select */}
                            <SelectRow
                                state={pageRowFilter.rowShow}
                                setState={setPageRowFilter}
                            />
                        </div>
                        {/* Pagination */}
                        <Pagination
                            totalRecords={songState.data.total}
                            currentPage={pageRowFilter.currentPage}
                            pageSize={pageRowFilter.rowShow.value}
                            onPageChange={setPageRowFilter}
                        />
                    </div>
                </>
            )}
        </PageWrapperWithLeftNav>
    );
};

export default View;

export const getSongData = (data: any) => {
    if (!data) return [];

    return data.map((item: any) => ({
        id: item.id,
        thumbnail: (
            <div className="flex justify-center items-center">
                <div
                    style={{
                        backgroundImage: `url(${item.thumbnail})`,
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
        title: (
            <div className="text-ellipsis overflow-hidden max-w-xs">
                {item.title}
            </div>
        ),
        artist: item.artists ? (
            item.artists.map((item: any) => (
                <div key={item.id}>{item.name}</div>
            ))
        ) : (
            <></>
        ),
        isSelected: item.isSelected,
        created: moment(item.createdAt).format(DayFormat),
        modified: moment(item.modifiedAt).format(DayFormat),
    }));
};
