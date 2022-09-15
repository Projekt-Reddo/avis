import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

// Components
import Button from "./Button";
import Icon from "./Icon";

import "theme/SearchFilter.css";

interface SearchFilterProps {
    handleSubmit: () => void;
    filterContent: {
        search: {
            placeholder: string;
            register: UseFormRegisterReturn;
        };
        selectMultiple?: any;
        dateInput?: any;
        radioBox?: any;
    };
}

// {
//     label: string;
//     registerStart: () => UseFormRegisterReturn;
//     registerEnd: () => UseFormRegisterReturn;
// }

const SearchFilter: React.FC<SearchFilterProps> = ({
    handleSubmit,
    filterContent,
}) => {
    const [showSearchFilter, setShowSearchFilter] =
        React.useState<boolean>(false);

    const handleClearFilter = () => {
        filterContent.selectMultiple.forEach(function (item: any) {
            item.setSelected([]);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Search Bar */}
            <div className="flex py-2">
                {/* Search Button */}
                <button
                    type="submit"
                    className="radius-border-left-side flex justify-center items-center bg-[color:var(--body-bg-color)] py-2 px-4 border-r-0"
                >
                    <Icon
                        icon="search"
                        className="text-[color:var(--teal-lighter-color)]"
                    />
                </button>

                {/* Search Input */}
                <input
                    className="input-search-app w-full"
                    placeholder={filterContent.search.placeholder}
                    {...filterContent.search.register}
                />

                {/* Show Filter Button */}
                <div
                    className="radius-border-right-side flex justify-center items-center cursor-pointer bg-[color:var(--body-bg-color)] py-2 px-4 border-r-0"
                    onClick={() => setShowSearchFilter(!showSearchFilter)}
                >
                    <div className="text-base font-bold pr-4">Filter</div>
                    <Icon
                        icon="filter"
                        className="text-[color:var(--teal-lighter-color)]"
                    />
                </div>
            </div>

            {/* Search Filter */}

            {showSearchFilter ? (
                <div className="radius-border text-[color:--text-primary-color] bg-[color:var(--body-bg-color)] px-5 py-3">
                    {/* Select Multiple Filter */}
                    {filterContent.selectMultiple.map((item: any) => (
                        <div className="w-full mt-4">
                            <div className="flex">
                                <div className="text-base font-bold self-center pr-5">
                                    {item.label}
                                </div>

                                <select
                                    className="input-app w-full"
                                    placeholder="Add a genre"
                                    onChange={(event) =>
                                        item.setSelected([
                                            ...item.selected,
                                            event.currentTarget.value,
                                        ])
                                    }
                                >
                                    <option value="Pop">Pop</option>
                                    <option value="Rock">Rock</option>
                                </select>
                            </div>

                            {/* Show Selected Items */}
                            <div className="flex max-w-full overflow-x-hidden pt-4">
                                {item.selected.map((itemSelected: any) => (
                                    <div
                                        key={item}
                                        className="flex px-4 py-2 text-sm font-bold text-[color:var(--body-bg-color)] bg-[color:var(--text-primary-color)] rounded-full mr-4"
                                    >
                                        <div className="pr-2">
                                            {itemSelected}
                                        </div>
                                        <div
                                            onClick={() =>
                                                item.setSelected(
                                                    item.selected.filter(
                                                        (selected: string) =>
                                                            selected !==
                                                            itemSelected
                                                    )
                                                )
                                            }
                                        >
                                            <Icon icon="times" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="h-[0.25px] w-full my-4 bg-[color:var(--text-primary-color)]" />

                    {/* Date Input Filter */}
                    <div className="flex justify-between">
                        {filterContent.dateInput.map((item: any) => (
                            <div>
                                <div className="text-base font-bold pb-4">
                                    {item.label}
                                </div>
                                <div className="flex">
                                    <input
                                        className="input-date px-2 py-1"
                                        {...item.registerStart}
                                        type="date"
                                    />
                                    <div className="self-center p-4">-</div>
                                    <input
                                        className="input-date px-2 py-1"
                                        {...item.registerEnd}
                                        type="date"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-[0.25px] w-full my-4 bg-[color:var(--text-primary-color)]" />

                    {/* Radio Box Filter */}

                    {/* <div>
                        <div className="text-base font-bold pb-4">
                            Report Type
                        </div>
                        <div className="flex">
                            <div className="flex mr-4">
                                <label className="font-bold text-[color:var(--text-secondary-color)] mr-2">
                                    Post
                                </label>
                                <input
                                    type="radio"
                                    className="none-shadow-button h-full"
                                    value="1"
                                    name="reportType"
                                />
                            </div>
                        </div>
                    </div> */}

                    {/* Clear, Close, Apply Filter  */}
                    <div className="flex justify-between pt-4">
                        {/* Clear Filter Button */}
                        <Button
                            className="none-shadow-button"
                            variant="danger"
                            onClick={handleClearFilter}
                        >
                            Clear all filter
                        </Button>

                        <div>
                            {/* Close Filter Button */}
                            <Button
                                className="none-shadow-button mr-5"
                                variant="secondary"
                                onClick={() => setShowSearchFilter(false)}
                            >
                                Close
                            </Button>

                            {/* Apply Filter Button */}
                            <Button
                                type="submit"
                                className="none-shadow-button"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                " "
            )}
        </form>
    );
};

export default SearchFilter;
