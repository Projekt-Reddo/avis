import { useEffect, useState } from "react";
import "theme/Table.css";

interface TableProps {
    className?: string;
    style?: any;
    columns: string[];
    displayData: TableRowData[];
    rawData: any[];
    hasSelectOption: boolean;
    onRowClick?: (obj: any) => void;
    setDataState: React.Dispatch<React.SetStateAction<TableRowData[]>>;
    setIsSelected?: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Table
 * @param {string} className the className pass to the outer most div
 * @param {object} style the styles pass to the outer most div
 * @param {array of strings} columns the columns want to render
 * @param {array of TableRowData} displayData the displayData pass to the table corresponding with columns
 * @param {boolean} hasSelectOption show check & check all button
 * @param {function} onRowClick the onClick callback on table row
 * @param {SetStateAction} setDataState set state for displayData param
 * @param {SetStateAction} setIsSelected pass the set state for is any row selected
 */
const Table: React.FC<TableProps> = ({
    className,
    style,
    columns,
    displayData,
    hasSelectOption = true,
    rawData,
    onRowClick = () => {},
    setDataState,
    setIsSelected,
}) => {
    const handleAllChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDataState(
            rawData.map((obj) => ({
                ...obj,
                isSelected: event.target.checked,
            }))
        );
        setIsCheckedAll(event.target.checked);
    };

    const handleChecked = (
        event: React.ChangeEvent<HTMLInputElement>,
        obj: TableRowData
    ) => {
        setDataState(
            rawData.map((oldValue) => {
                if (oldValue.id === obj.id) {
                    return {
                        ...oldValue,
                        isSelected: event.target.checked,
                    };
                }
                return oldValue;
            })
        );
    };

    // Handle check to checkAll button after all of rows is checked
    const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);
    useEffect(() => {
        var checkedData = rawData.filter((obj) => obj.isSelected === true);
        if (checkedData.length === displayData.length) {
            setIsCheckedAll(true);
        } else {
            setIsCheckedAll(false);
        }

        if (checkedData.length > 0 && setIsSelected) {
            setIsSelected(true);
        } else if (checkedData.length == 0 && setIsSelected) {
            setIsSelected(false);
        }
    }, [displayData]);

    if (!displayData || !columns) return <></>;

    return (
        <div className={`${className}`} style={{ ...style }}>
            <div className="select-all-mobile px-6 py-4">
                {/* CheckAll button for mobile */}
                {hasSelectOption && (
                    <label className="flex justify-start items-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4"
                            onChange={handleAllChecked}
                            checked={isCheckedAll}
                            value={"random"}
                        />
                        <span className="ml-4 text-lg">Select all</span>
                    </label>
                )}
            </div>
            <table
                className="table-component min-w-full table-auto"
                style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 0.5rem",
                }}
            >
                <thead className="font-bold">
                    <tr>
                        {/* CheckAll button */}
                        {hasSelectOption && (
                            <th className="text-sm px-6 py-4">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4"
                                        onChange={handleAllChecked}
                                        checked={isCheckedAll}
                                        value={"random"}
                                        data-cy="table-select-all-input"
                                    />
                                </label>
                            </th>
                        )}

                        {/* Table heading */}
                        {columns.map((col: string, index) => (
                            <th
                                key={index + "th"}
                                className="text-sm text-[color:var(--text-primary-color)] px-6 py-4"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody data-cy="table-body">
                    {displayData.map((obj, index) => (
                        <tr
                            key={obj.id + index + "tr"}
                            className="hover:shadow-lg hover:bg-[color:var(--element-bg-color-elevate-2)] border-[length:var(--border-width)] border-[color:var(--border-color)]"
                            onClick={() => {
                                onRowClick(obj);
                            }}
                            data-cy="table-row"
                        >
                            {hasSelectOption && (
                                <td className="bg-[color:var(--element-bg-color)] px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                            onChange={(event) =>
                                                handleChecked(event, obj)
                                            }
                                            onClick={(event) => {
                                                event.stopPropagation(); // Check the checkbox rather than onClick to parent element
                                            }}
                                            checked={obj.isSelected}
                                            value={obj.id}
                                            disabled={
                                                obj.isSelected === null
                                                    ? true
                                                    : false
                                            }
                                            data-cy="table-select-row-input"
                                        />
                                    </label>
                                </td>
                            )}
                            {Object.keys(obj).map(
                                (key, attrIndex) =>
                                    key !== "id" &&
                                    key !== "isSelected" && (
                                        <td
                                            key={obj.id + attrIndex + "td"}
                                            className="bg-[color:var(--element-bg-color)] text-sm text-[color:var(--text-primary-color)] font-light px-6 py-3"
                                        >
                                            {/* Mobile table heading */}
                                            <span
                                                className="thead-mobile mr-2 font-bold"
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {key}:
                                            </span>
                                            <span>{obj[key]}</span>
                                        </td>
                                    )
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
