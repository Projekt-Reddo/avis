import { useState } from "react";
import { Link } from "react-router-dom";
import "theme/TabsNav.css";
import Icon from "./Icon";

const TabsNav = () => {
    const [tabSelect, setTabselect] = useState("search");

    return (
        <nav className="grid grid-cols-4 gap-4 fixed nav-height min-w-full bottom-0 border-t">
            <Link
                to="/search"
                className={
                    tabSelect === "search" ? "tab-button-select" : "tab-button"
                }
                onClick={() => setTabselect("search")}
            >
                <Icon icon="search" className="text-2xl p-4" />
            </Link>

            <Link
                to="/discover"
                className={
                    tabSelect === "discover"
                        ? "tab-button-select"
                        : "tab-button"
                }
                onClick={() => setTabselect("discover")}
            >
                <Icon
                    icon={
                        tabSelect === "discover"
                            ? "compass"
                            : ["far", "compass"]
                    }
                    className="text-2xl p-4"
                />
            </Link>

            <Link
                to="/notification"
                className={
                    tabSelect === "notification"
                        ? "tab-button-select"
                        : "tab-button"
                }
                onClick={() => setTabselect("notification")}
            >
                <div className="flex justify-center items-center p-4">
                    <div className="absolute flex justify-center items-center h-3 w-3 bg-[color:var(--red-darker-color)] font-bold rounded-full text-white text-[10px] ml-4 mb-6">
                        2
                    </div>
                    <Icon
                        icon={
                            tabSelect === "notification"
                                ? "bell"
                                : ["far", "bell"]
                        }
                        className="text-2xl"
                    />
                </div>
            </Link>

            <Link
                to="/login"
                className={
                    tabSelect === "auth" ? "tab-button-select" : "tab-button"
                }
                onClick={() => setTabselect("auth")}
            >
                <Icon
                    icon={
                        tabSelect === "auth"
                            ? "user-circle"
                            : ["far", "user-circle"]
                    }
                    className="text-2xl p-4"
                />
            </Link>
        </nav>
    );
};

export default TabsNav;
