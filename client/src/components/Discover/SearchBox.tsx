// Libs
import { UseFormRegisterReturn } from "react-hook-form";

// Components
import Icon from "components/shared/Icon";

interface SearchBoxProps {
    content?: string;
    register: UseFormRegisterReturn;
    handleSubmit: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    content,
    register,
    handleSubmit,
}) => {
    return (
        <form className="search-card flex w-full" onSubmit={handleSubmit}>
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
                value={content}
                placeholder="Search"
                {...register}
            />
        </form>
    );
};

export default SearchBox;
