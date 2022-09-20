import Icon from "components/shared/Icon";
import React from "react";

import "./left-nav.styles.css";

const LeftNav = () => {
    return (
        <nav className="left-nav left-nav-border flex flex-col items-center justify-evenly px-6">
            <div className="w-full flex flex-col items-center">
                <div
                    className="w-full flex flex-row items-center rounded-lg p-3 pl-6 my-1 font-bold"
                    style={{
                        background: "rgba(55, 63, 65, 0.1)",
                    }}
                >
                    <Icon icon="home" className="pr-3" />
                    <div>Hello Sekai</div>
                </div>

                <div className="w-full flex flex-row items-center rounded-lg p-3 pl-6 my-1 font-bold">
                    <Icon icon="home" className="pr-3" />
                    <div>Hello Sekai</div>
                </div>

                <div className="w-full flex flex-row items-center rounded-lg p-3 pl-6 my-1 font-bold">
                    <Icon icon="home" className="pr-3" />
                    <div>Hello Sekai</div>
                </div>

                <div className="w-full flex flex-row items-center rounded-lg p-3 pl-6 my-1 font-bold">
                    <Icon icon="home" className="pr-3" />
                    <div>Hello Sekai</div>
                </div>

                <div className="w-full flex flex-row items-center rounded-lg p-3 pl-6 my-1 font-bold">
                    <Icon icon="home" className="pr-3" />
                    <div>Hello Sekai</div>
                </div>
            </div>
            <div></div>
        </nav>
    );
};

export default LeftNav;
