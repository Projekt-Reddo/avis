import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { setSong, viewSongAsync } from "store/slices/songSlice";

import moment from "moment";

// Components
import Icon from "components/shared/Icon";
import Table from "components/shared/Table";
import PageWrapper from "components/shared/PageWrapper";
import SearchFilter from "components/shared/SearchFilter";
import SelectRow from "components/shared/SelectRow";
import Pagination from "components/shared/Pagination";

import { FieldValues, useForm } from "react-hook-form";
import { DayFormat } from "utils/constants";
import { Link } from "react-router-dom";
import { recommendGenreApi } from "api/genre-api";
import Loading from "components/shared/Loading";

const View = () => {
    const dispatch = useAppDispatch();

    const songState = useAppSelector((state) => state.song);

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
            title: "",
            genres: [],
            createdStart: "",
            createdEnd: "",
            modifiedStart: "",
            modifiedEnd: "",
        },
    });

    const handleSearch = (data: FieldValues) => {
        dispatch(
            viewSongAsync({
                page: currentPage,
                size: rowShow.value,
                filter: {
                    title: data.title,
                    genres: data.genres.length > 0 ? data.genres : null,
                    createdStart:
                        data.createdStart !== "" ? data.createdStart : null,
                    createdEnd: data.createdEnd !== "" ? data.createdEnd : null,
                    modifiedStart:
                        data.modifiedStart !== "" ? data.modifiedStart : null,
                    modifiedEnd:
                        data.modifiedEnd !== "" ? data.modifiedEnd : null,
                },
            } as SongFilter)
        );
    };

    useEffect(() => {
        dispatch(
            viewSongAsync({
                page: currentPage,
                size: rowShow.value,
                filter: {},
            })
        );
    }, [currentPage, rowShow]);

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
        <PageWrapper className="bg-[#F0F0F5]">
            {/* Header */}
            <div className="flex justify-between pt-2">
                <div className="text-lg font-bold">Song</div>
                <Link to="/admin/song/create">
                    <div
                        className="h-9 w-9 flex justify-center items-center text-[color:var(--teal-lighter-color)] bg-[color:var(--body-bg-color)]"
                        style={{
                            borderRadius: "50%",
                            border: "3px solid var(--teal-lighter-color)",
                        }}
                    >
                        <Icon icon="plus" />
                    </div>
                </Link>
            </div>

            {/* Search Bar */}
            <SearchFilter
                placeholder="Enter title of song"
                register={register("title")}
                handleSubmit={handleSubmit(handleSearch)}
                setValue={setValue}
                filterContent={filterContent}
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
                        data={songState.tableData.payload}
                        hasSelectOption={true}
                        setDataState={(data) => dispatch(setSong(data))}
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
                            totalRecords={songState.data.total}
                            currentPage={currentPage}
                            pageSize={rowShow.value}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </PageWrapper>
    );
};

export default View;

export const getSongData = (data: any) => {
    return data.payload.map((item: any) => ({
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
        title: item.title,
        artist: item.artists.map((item: any) => (
            <div key={item.id}>{item.name}</div>
        )),
        created: moment(item.createdAt).format(DayFormat),
        modified: moment(item.modifiedAt).format(DayFormat),
    }));
};
