// Libs
import { UseFormRegisterReturn } from "react-hook-form";

// Components
import Icon from "components/shared/Icon";

interface SearchBoxProps {
    register: UseFormRegisterReturn;
    handleSubmit: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ register, handleSubmit }) => {
    return (
        <form className="card flex" onSubmit={handleSubmit}>
            {/* Search Button */}
            <button
                type="submit"
                className="flex justify-center items-center bg-[color:var(--body-bg-color)] py-2 px-4 focus:outline-none"
                style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
            >
                <Icon
                    icon="search"
                    className="text-[color:var(--teal-lighter-color)]"
                />
            </button>

            {/* Search Input */}
            <input
                className="w-full focus:outline-none bg-[color:var(--body-bg-color)] p-2"
                style={{ borderTopRightRadius: 8, borderBottomRightRadius: 8 }}
                placeholder="Search"
                {...register}
            />
        </form>
    );
};

export default SearchBox;
