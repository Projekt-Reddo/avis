import React from "react";
import {
    UseFormRegisterReturn,
    UseFormReset,
    UseFormSetValue,
} from "react-hook-form";
import Button from "components/Button/Button";
import Icon from "components/shared/Icon";
import "theme/SearchFilter.css";

interface SearchFilterProps {
    handleSubmit: () => void;
    setValue: UseFormSetValue<any>;
    textInput: {
        placeholder?: string;
        register: UseFormRegisterReturn;
    };
    filterContent: any;
    reset: UseFormReset<any>;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    textInput,
    handleSubmit,
    filterContent,
    reset,
}) => {
    const [showSearchFilter, setShowSearchFilter] =
        React.useState<boolean>(false);

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
                    placeholder={textInput.placeholder}
                    {...textInput.register}
                />

                {/* Show Filter Button */}
                {filterContent && (
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
                )}
            </div>

            {/* Search Filter */}
            {showSearchFilter && (
                <div className="radius-border text-[color:--text-primary-color] bg-[color:var(--body-bg-color)] p-4 grid grid-cols-1 gap-4">
                    {filterContent && filterContent}

                    <div className="h-[0.25px] w-full bg-[color:var(--border-color)]" />

                    {/* Clear, Close, Apply Filter  */}
                    <div className="flex flex-row justify-between">
                        {/* Clear Filter Button */}
                        <Button
                            className="none-shadow-button mr-4 w-fit"
                            type="button"
                            variant="danger"
                            onClick={() => reset()}
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
