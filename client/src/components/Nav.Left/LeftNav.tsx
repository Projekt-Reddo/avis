import Icon from "components/shared/Icon";
import React, { useState } from "react";
import { leftNavAdmin } from "utils/constants";

import "./left-nav.styles.css";
import LeftNavItem from "./LeftNav.Item";

const LeftNav = () => {
    const [active, setActive] = useState("/admin/dashboard");

    return (
        <nav className="left-nav left-nav-border flex flex-col items-center justify-evenly px-6">
            <div className="w-full flex flex-col items-center">
                {leftNavAdmin.map((item) => {
                    return (
                        <LeftNavItem
                            itemData={item}
                            isActive={active === item.path}
                        />
                    );
                })}
            </div>
            <div></div>
        </nav>
    );
};

export default LeftNav;
