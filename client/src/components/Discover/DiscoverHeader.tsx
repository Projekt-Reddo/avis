import Icon from "components/shared/Icon";
import React from "react";
import { Link } from "react-router-dom";

const DiscoverHeader = () => {
    return (
        <div className="lg:hidden flex justify-between items-center p-4">
            <div className="text-2xl">Discover</div>
            <Link to="/search/discover">
                <Icon
                    className="text-2xl text-[color:var(--teal-lighter-color)]"
                    icon="search"
                />
            </Link>
        </div>
    );
};

export default DiscoverHeader;
