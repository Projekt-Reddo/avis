import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";
import Loading from "components/shared/Loading";
import Pagination from "components/shared/Pagination";
import SearchFilter from "components/SearchFilters/SearchFilters";
import SelectRow from "components/shared/SelectRow";
import Table from "components/shared/Table";
import moment from "moment";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { getAsync, setTableData } from "store/slices/reportSlice";
import { DAY_FORMAT, REPORT_TYPE } from "utils/constants";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import Input from "components/shared/Input";

const ViewReport = () => {
    const dispatch = useAppDispatch();

    const reportState = useAppSelector((state) => state.report);

    const [haveAnyItemSelected, setHaveAnyItemSelected] =
        React.useState<boolean>(false);

    const [pageRowFilter, setPageRowFilter] = React.useState<ReportFilterState>(
        {
            currentPage: 1,
            rowShow: {
                value: 10,
                label: "10 rows",
            },
            filter: {
                from: null!,
                to: null!,
                isPost: null!,
                type: null!,
            },
        }
    );

    const { register, handleSubmit, setValue, reset } = useForm({
        mode: "onChange",
        defaultValues: {
            from: null,
            to: null,
            isPost: null,
            type: null,
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
                from: data.from,
                to: data.to,
                isPost: data.isPost,
                type: data.type,
            },
        });
    };

    useEffect(() => {
        dispatch(
            getAsync({
                page: pageRowFilter.currentPage,
                size: pageRowFilter.rowShow.value,
                filter: {
                    from: pageRowFilter.filter?.from,
                    to: pageRowFilter.filter?.to,
                    type: pageRowFilter.filter?.type,
                    // @ts-ignore
                    isPost:
                        pageRowFilter.filter?.isPost === "true"
                            ? true
                            : pageRowFilter.filter?.isPost === "false"
                            ? false
                            : null,
                },
            })
        );
    }, [pageRowFilter]);

    const filterContent = (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="font-bold pb-2">Report Object</p>
                    <div className="flex flex-row gap-3 mt-3">
                        <label className="flex flex-row gap-3 items-center">
                            <p>Post</p>
                            <input
                                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                type={"radio"}
                                value={"true"}
                                {...register("isPost")}
                            />
                        </label>
                        <label className="flex flex-row gap-3 items-center">
                            <p>Comment</p>
                            <input
                                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                type={"radio"}
                                value={"false"}
                                {...register("isPost")}
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <div className="text-base font-bold pb-2">Created Date</div>
                    <div className="flex flex-row justify-between">
                        <Input
                            type="date"
                            className="w-[45%]"
                            register={register("from")}
                        />

                        <div className="self-center">-</div>

                        <Input
                            type="date"
                            className="w-[45%]"
                            register={register("to")}
                        />
                    </div>
                </div>
            </div>
            <div>
                <p className="font-bold pb-2">Report Type</p>
                <div className="flex flex-row gap-8 mt-3">
                    {Object.values(REPORT_TYPE).map((value, index) => {
                        return (
                            <label
                                className="flex flex-row gap-3 items-center"
                                key={value + index}
                            >
                                <p>{value}</p>
                                <input
                                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    type={"radio"}
                                    value={value}
                                    {...register("type")}
                                />
                            </label>
                        );
                    })}
                </div>
            </div>
        </>
    );

    return (
        <PageWrapperWithLeftNav className="bg-[#F0F0F5]">
            <div className="flex justify-between pt-6">
                <div className="text-lg font-bold">Report</div>
            </div>

            <SearchFilter
                textInput={{
                    placeholder: "Enter the name of the artist",
                    register: register("name"),
                }}
                reset={reset}
                handleSubmit={handleSubmit(handleSearch)}
                setValue={setValue}
                filterContent={filterContent}
            />

            {/* Data Table */}
            {reportState.status === "loading" || !reportState.tableData ? (
                // Loading Components
                <div className="flex justify-center items-center mt-8">
                    <Loading />
                </div>
            ) : reportState.status === "error" ? (
                // Error show
                <div className="flex justify-center items-center mt-8 text-lg">
                    <div>{reportState.status}</div>
                </div>
            ) : reportState.status === "idle" &&
              reportState.tableData.length > 0 ? (
                <>
                    {/* Data Table */}
                    <Table
                        className=""
                        columns={[
                            "Reporter",
                            "Reportee",
                            "Type",
                            "Object",
                            "Status",
                            "Confirmed by",
                            "Created",
                        ]}
                        displayData={getTableDisplayData(reportState.tableData)}
                        hasSelectOption={true}
                        setDataState={(data) => dispatch(setTableData(data))}
                        rawData={reportState.tableData}
                        onRowClick={() => {
                            // history.push(`/admin/song/edit/${obj.id}`);
                        }}
                        setIsSelected={setHaveAnyItemSelected}
                    />

                    <div className="sm:flex sm:justify-between mb-3">
                        <div>
                            {/* Show rows select */}
                            <SelectRow
                                state={pageRowFilter.rowShow}
                                setState={setPageRowFilter}
                            />
                        </div>
                        {/* Pagination */}
                        <Pagination
                            totalRecords={reportState.data.total}
                            currentPage={pageRowFilter.currentPage}
                            pageSize={pageRowFilter.rowShow.value}
                            onPageChange={setPageRowFilter}
                        />
                    </div>
                </>
            ) : (
                <div className="grid place-items-center w-full mt-5 font-bold">
                    No items found
                </div>
            )}
        </PageWrapperWithLeftNav>
    );
};

export default ViewReport;

function getTableDisplayData(data: any) {
    if (!data) return [];

    return data.map((item: any) => ({
        id: item.id,
        reporter: item.user.name,
        reportee: item.post ? item.post.user.name : item.comment!.user.name,
        type: item.type,
        object: item.post ? "Post" : "Comment",
        status: item.status ? item.status : "waiting",
        confirmBy: item.confirmedBy ? item.confirmedBy.name : "",
        createdAt: moment(item.createdAt).format(DAY_FORMAT),
        isSelected: item.isSelected,
    }));
}
