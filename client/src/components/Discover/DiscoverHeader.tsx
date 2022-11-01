// Libs
import { Link } from "react-router-dom";

// Components
import Icon from "components/shared/Icon";

const DiscoverHeader = () => {
    return (
        <div className="lg:hidden flex justify-between items-center p-4">
            <div className="text-2xl">Discover</div>
            <Link
                to={{
                    pathname: "/search/discover",
                    state: {},
                }}
            >
                <Icon
                    className="text-2xl text-[color:var(--teal-lighter-color)]"
                    icon="search"
                />
            </Link>
        </div>
    );
};

export default DiscoverHeader;
