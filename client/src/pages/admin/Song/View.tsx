import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { setSong, viewSongAsync } from "store/slices/songSlice";

import moment from "moment";

// Components
import Icon from "components/shared/Icon";
import Table from "components/shared/Table";
import PageWrapper from "components/shared/PageWrapper";
import SearchFilter from "components/shared/SearchFilter";

import { FieldValues, useForm } from "react-hook-form";
import { DayFormat } from "utils/constants";
import { Link } from "react-router-dom";
import { recommendGenreApi } from "api/genre-api";
import { string } from "yup/lib/locale";

const View = () => {
    const songState = useAppSelector((state) => state.song);

    const [isSelected, setIsSelected] = React.useState<boolean>(false);

    const [selectedGenre, setSelectedGenre] = React.useState<string[]>([]);

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

    const dispatch = useAppDispatch();

    const handleSearch = (data: FieldValues) => {
        dispatch(
            viewSongAsync({
                page: 1,
                size: 5,
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
                page: 1,
                size: 10,
                filter: {},
            })
        );
    }, []);

    if (songState.status === "loading") {
        return (
            <div className="flex justify-center items-center">
                <div
                    className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    // if (songState.status === "error") {
    //     return <div>Error</div>;
    // }

    const filterContent = {
        search: {
            placeholder: "Enter title of song",
            register: register("title"),
        },
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
        // radioBox: [
        //     {
        //         label: "Report Type",
        //     }
        // ],
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
                handleSubmit={handleSubmit(handleSearch)}
                setValue={setValue}
                filterContent={filterContent}
            />

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
        </PageWrapper>
    );
};

export default View;

export const getSongData = (data: any) => {
    return data.payload.map((item: any) => ({
        id: item.id,
        thumbnail: (
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
        ),
        title: item.title,
        artist: item.artist,
        created: moment(item.createdAt).format(DayFormat),
        modified: moment(item.modifiedAt).format(DayFormat),
    }));
};
