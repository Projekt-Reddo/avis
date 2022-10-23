import React from "react";
import {
    UseFormRegisterReturn,
    UseFormSetValue,
} from "react-hook-form";

// Components
import Button from "../Button/Button";
import Icon from "./Icon";
import SelectAsync from "./SelectAsync";


// Styles
import "theme/SearchFilter.css";

interface SearchFilterProps {
    placeholder?: string;
    register: UseFormRegisterReturn;
    handleSubmit: () => void;
    setValue: UseFormSetValue<any>;
    filterContent?: {
        selectMultiple?: {
            label?: string;
            isMulti: boolean;
            loadOptionsCallback: (keyword: string) => Promise<any>;
            control: any;
            controlName: string;
        }[];
        dateInput?: {
            label?: string;
            registerStart: InputRegister;
            registerEnd: InputRegister;
        }[];
        radioBox?: {
            label?: string;
            checkBox: InputRegister;
        }[];
    };
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    placeholder,
    register,
    handleSubmit,
    setValue,
    filterContent,
}) => {
    const [showSearchFilter, setShowSearchFilter] =
        React.useState<boolean>(false);

    const handleClearFilter = () => {
        filterContent?.selectMultiple?.forEach((element) => {
            setValue(element.controlName, "");
        });

        filterContent?.dateInput?.forEach((element) => {
            setValue(element.registerStart.name, "");
            setValue(element.registerEnd.name, "");
        });

        filterContent?.radioBox?.forEach((element) =>
        {
            setValue(element.checkBox.name, false)
        })
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Search Bar */}
            <div className="flex py-2">
                {/* Search Button */}
                <button
                    type="submit"
                    className="radius-border-left-side flex justify-center items-center bg-[color:var(--body-bg-color)] py-2 px-4 border-r-0 focus:outline-none"
                >
                    <Icon
                        icon="search"
                        className="text-[color:var(--teal-lighter-color)]"
                    />
                </button>

                {/* Search Input */}
                <input
                    className={`${
                        filterContent
                            ? "input-search-app w-full focus:outline-none"
                            : "input-search-app-only w-full focus:outline-none"
                    }`}
                    placeholder={placeholder}
                    {...register}
                />

                {/* Show Filter Button */}
                {filterContent ? (
                    <button
                        type="button"
                        className="radius-border-right-side flex justify-center items-center cursor-pointer bg-[color:var(--body-bg-color)] py-2 px-4 border-l-0 focus:outline-none"
                        onClick={() => setShowSearchFilter(!showSearchFilter)}
                    >
                        <div className="text-base font-bold pr-4">Filter</div>
                        <Icon
                            icon="filter"
                            className="text-[color:var(--teal-lighter-color)]"
                        />
                    </button>
                ) : (
                    " "
                )}
            </div>

            {/* Search Filter */}

            {showSearchFilter ? (
                <div className="radius-border text-[color:--text-primary-color] bg-[color:var(--body-bg-color)] px-4">
                    {/* Select Multiple Filter */}

                    {filterContent?.selectMultiple?.map((item) => (
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
                                optionConfig={{
                                    label: "name",
                                    value: "name",
                                }}
                            />
                        </div>
                    ))}

                    <div className="h-[0.25px] w-full bg-[color:var(--text-primary-color)]" />

                    {/* Date Input Filter */}
                    <div className={(filterContent?.radioBox != null) ? "grid grid-cols-1 md:flex"  : "grid grid-cols-1" } >
                        <div className="grid grid-cols-1 md:grid-cols-2 justify-start py-4 ">
                            {filterContent?.dateInput?.map((item) => (
                                <div key={item.label}>
                                    <div className="text-base font-bold pb-2  mb-5">
                                        {item.label}
                                    </div>
                                    <div className="flex relative">
                                        <input
                                            className="input-date px-2 py-1"
                                            {...item.registerStart}
                                            type="date"
                                        />
                                        <div className="absolute ml-[8rem] mt-1.5">
                                            <Icon
                                                icon="calendar"
                                                className="w-5 text-[color:var(--text-secondary-color)]"
                                                size="l"
                                            />
                                        </div>
                                        <div className="self-center px-4">-</div>
                                        <input
                                            className="input-date px-2 py-1"
                                            {...item.registerEnd}
                                            type="date"
                                        />
                                        <div className="absolute ml-[20rem] mt-1.5">
                                            <Icon
                                                icon="calendar"
                                                className="w-5 text-[color:var(--text-secondary-color)]"
                                                size="l"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(filterContent?.radioBox != null) ?
                        <>
                        <div className="search-bar h-[0.25px] w-full bg-[color:var(--text-primary-color)]" />
                        <div className="">
                            <div className="text-base font-bold self-center mt-3 mb-5 md:ml-[7rem]">
                                Status
                            </div>
                            {/* Radio Box Filter */}
                            <div className="grid grid-cols-3 gap-6 py-2">
                                {filterContent?.radioBox?.map((item) => (
                                        <div className="grid justify-start">
                                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in ml-2">
                                                <input type="checkbox"
                                                {...item.checkBox}
                                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"/>
                                                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                            </div>
                                        <div className="text-base self-center mt-3 mb-3 text-center ">
                                            {item.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        </>
                        :
                        <></>}
                    </div>
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
