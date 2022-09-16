import React from "react";
import {
    Control,
    UseFormRegisterReturn,
    UseFormSetValue,
} from "react-hook-form";

// Components
import Button from "./Button";
import Icon from "./Icon";
import SelectAsync from "./SelectAsync";

// Styles
import "theme/SearchFilter.css";

interface SearchFilterProps {
    handleSubmit: () => void;
    setValue: UseFormSetValue<any>;
    filterContent: {
        search: {
            placeholder: string;
            register: UseFormRegisterReturn;
        };
        selectMultiple?: {
            label?: string;
            isMulti: boolean;
            loadOptionsCallback: (keyword: string) => Promise<any>;
            control: Control<any>;
            controlName: string;
        }[];
        dateInput?: {
            label?: string;
            registerStart: InputRegister;
            registerEnd: InputRegister;
        }[];
        radioBox?: any;
    };
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    handleSubmit,
    setValue,
    filterContent,
}) => {
    const [showSearchFilter, setShowSearchFilter] =
        React.useState<boolean>(false);

    const handleClearFilter = () => {
        filterContent.selectMultiple?.forEach((element) => {
            setValue(element.controlName, "");
        });

        filterContent.dateInput?.forEach((element) => {
            setValue(element.registerStart.name, "");
            setValue(element.registerEnd.name, "");
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
                <button
                    type="button"
                    className="radius-border-right-side flex justify-center items-center cursor-pointer bg-[color:var(--body-bg-color)] py-2 px-4 border-r-0"
                    onClick={() => setShowSearchFilter(!showSearchFilter)}
                >
                    <div className="text-base font-bold pr-4">Filter</div>
                    <Icon
                        icon="filter"
                        className="text-[color:var(--teal-lighter-color)]"
                    />
                </button>
            </div>

            {/* Search Filter */}

            {showSearchFilter ? (
                <div className="radius-border text-[color:--text-primary-color] bg-[color:var(--body-bg-color)] px-4">
                    {/* Select Multiple Filter */}

                    {filterContent.selectMultiple?.map((item) => (
                        <div key={item.label} className="w-full py-4">
                            <div className="text-base font-bold self-center mb-2">
                                {item.label}
                            </div>
                            <SelectAsync
                                className="w-full"
                                isMulti={item.isMulti}
                                loadOptionsCallback={item.loadOptionsCallback}
                                control={item.control}
                                controlName={item.controlName}
                            />
                        </div>
                    ))}

                    <div className="h-[0.25px] w-full bg-[color:var(--text-primary-color)]" />

                    {/* Date Input Filter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-start py-4">
                        {filterContent.dateInput?.map((item) => (
                            <div key={item.label}>
                                <div className="text-base font-bold pb-2">
                                    {item.label}
                                </div>
                                <div className="flex">
                                    <input
                                        className="input-date px-2 py-1"
                                        {...item.registerStart}
                                        type="date"
                                    />
                                    <div className="self-center px-4">-</div>
                                    <input
                                        className="input-date px-2 py-1"
                                        {...item.registerEnd}
                                        type="date"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-[0.25px] w-full bg-[color:var(--text-primary-color)]" />

                    {/* Radio Box Filter */}

                    {/* Up comming in future */}

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 justify-end py-4">
                        {/* Clear Filter Button */}
                        <Button
                            className="none-shadow-button mr-4 w-fit"
                            type="button"
                            variant="danger"
                            onClick={() => handleClearFilter()}
                        >
                            Clear filter
                        </Button>
                        <div className="flex justify-start sm:justify-end pt-4 sm:pt-0">
                            {/* Close Filter Button */}
                            <Button
                                className="none-shadow-button mr-4"
                                type="button"
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
