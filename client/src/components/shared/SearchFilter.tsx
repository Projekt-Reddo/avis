import React from "react";
import { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

// Components
import Button from "../Button/Button";
import Icon from "./Icon";
import SelectAsync from "./SelectAsync";

// Styles
import "theme/SearchFilter.css";
import Input from "./Input";

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

        filterContent?.radioBox?.forEach((element) => {
            setValue(element.checkBox.name, false);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Search Bar */}
            <div className="flex py-2">
                {/* Search Button */}
                <button
                    type="submit"
                    className="radius-border-left-side flex justify-center items-center bg-[color:var(--body-bg-color)] py-2 px-4 border-r-0 focus:outline-none"
                    data-cy="search-filter-submit-btn"
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
                    data-cy="search-filter-input"
                    {...register}
                />

                {/* Show Filter Button */}
                {filterContent ? (
                    <button
                        type="button"
                        className="radius-border-right-side flex justify-center items-center cursor-pointer bg-[color:var(--body-bg-color)] py-2 px-4 border-l-0 focus:outline-none"
                        onClick={() => setShowSearchFilter(!showSearchFilter)}
                        data-cy="show-filter-btn"
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
            {showSearchFilter && (
                <div className="radius-border text-[color:--text-primary-color] bg-[color:var(--body-bg-color)] p-4 grid grid-cols-1 gap-4">
                    {/* Select Multiple Filter */}
                    {filterContent?.selectMultiple?.map((item) => (
                        <div key={item.label} className="grid grid-cols-6">
                            <div className="text-base font-bold self-center">
                                {item.label}
                            </div>
                            <SelectAsync
                                className="w-full col-span-5"
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

                    <div className="h-[0.25px] w-full bg-[color:var(--border-color)]" />

                    {/* Date Input Filter */}
                    <div
                        className={
                            filterContent?.radioBox != null
                                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                                : "grid grid-cols-1"
                        }
                    >
                        <div
                            className={`grid grid-cols-1 md:grid-cols-2 ${
                                filterContent?.radioBox && "md:grid-cols-1"
                            } gap-10 justify-start`}
                        >
                            {filterContent?.dateInput?.map((item) => (
                                <div key={item.label}>
                                    <div className="text-base font-bold pb-2">
                                        {item.label}
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <Input
                                            type="date"
                                            className="w-[45%]"
                                            register={item.registerStart}
                                            data-cy="filter-start-date"
                                        />

                                        <div className="self-center">-</div>

                                        <Input
                                            type="date"
                                            className="w-[45%]"
                                            register={item.registerEnd}
                                            data-cy="filter-end-date"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filterContent?.radioBox != null ? (
                            <>
                                <div className="">
                                    <div className="text-base font-bold self-center pb-2">
                                        Status
                                    </div>
                                    {/* Radio Box Filter */}
                                    <div className="grid grid-cols-3 gap-6 mt-0 md:mt-3">
                                        {filterContent?.radioBox?.map(
                                            (item) => (
                                                <div
                                                    className="flex flex-col md:flex-row gap-3"
                                                    key={item.label}
                                                >
                                                    <div className="text-base">
                                                        {item.label}
                                                    </div>
                                                    <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                                        <input
                                                            type="checkbox"
                                                            {...item.checkBox}
                                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
                                                            data-cy={`toggle-${item.label}`}
                                                        />
                                                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="h-[0.25px] w-full bg-[color:var(--border-color)]" />

                    {/* Clear, Close, Apply Filter  */}
                    <div className="flex flex-row justify-between">
                        {/* Clear Filter Button */}
                        <Button
                            className="none-shadow-button mr-4 w-fit"
                            type="button"
                            variant="danger"
                            onClick={() => handleClearFilter()}
                        >
                            Clear filter
                        </Button>

                        <div className="flex justify-start sm:justify-end sm:pt-0">
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
                                data-cy="apply-filter-btn"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default SearchFilter;
