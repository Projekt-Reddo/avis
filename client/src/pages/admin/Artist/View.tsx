import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";
import ViewHeader from "components/Admin/View/ViewHeader";
import Table from "components/shared/Table";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import Pagination from "components/shared/Pagination";
import SelectRow from "components/shared/SelectRow";
import React, { useEffect } from "react";
import { setTableData, viewArtistAsync } from "store/slices/artistSlice";
import Loading from "components/shared/Loading";
import SearchFilter from "components/shared/SearchFilter";
import { FieldValues, useForm } from "react-hook-form";

const ViewArtist = () => {
    const dispatch = useAppDispatch();

    const artistState = useAppSelector((state) => state.artist);

    const [haveAnyItemSelected, setHaveAnyItemSelected] =
        React.useState<boolean>(false);

    const [pageRowFilter, setPageRowFilter] = React.useState<ArtistFilterState>(
        {
            currentPage: 1,
            rowShow: {
                value: 10,
                label: "10 rows",
            },
            filter: {},
        }
    );

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
            },
        });
    };

    useEffect(() => {
        dispatch(
            viewArtistAsync({
                page: pageRowFilter.currentPage,
                size: pageRowFilter.rowShow.value,
                filter: pageRowFilter.filter,
            })
        );
    }, [pageRowFilter]);

    return (
        <PageWrapperWithLeftNav className="bg-[#F0F0F5]">
            <ViewHeader title="Artist" addButtonUrl="/admin/artist/create" />

            {/* Search Bar */}
            <SearchFilter
                placeholder="Enter the name of the artist"
                register={register("name")}
                handleSubmit={handleSubmit(handleSearch)}
                setValue={setValue}
            />

            {/* Data Table */}
            {artistState.status === "loading" || !artistState.tableData ? (
                // Loading Components
                <div className="flex justify-center items-center mt-8">
                    <Loading />
                </div>
            ) : artistState.status === "error" ? (
                // Error show
                <div className="flex justify-center items-center mt-8 text-lg">
                    <div>{artistState.status}</div>
                </div>
            ) : (
                <>
                    {/* Data Table */}
                    <Table
                        className=""
                        columns={["Thumbnail", "Name"]}
                        displayData={getArtistDisplayData(
                            artistState.tableData
                        )}
                        hasSelectOption={true}
                        setDataState={(data) => dispatch(setTableData(data))}
                        rawData={artistState.tableData}
                        onRowClick={(obj) => {
                            // history.push(`/admin/song/edit/${obj.id}`);
                        }}
                        setIsSelected={setHaveAnyItemSelected}
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
                            totalRecords={artistState.data.total}
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

export default ViewArtist;

function getArtistDisplayData(data: any) {
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
        name: <div className="text-ellipsis overflow-hidden">{item.name}</div>,
        isSelected: item.isSelected,
    }));
}
