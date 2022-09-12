import { Link, useLocation } from "react-router-dom";
import "theme/Nav.css";
import { routesIgnoreNav } from "utils/constants";
import Icon from "./Icon";
import Dropdown from "components/shared/Dropdown";
import { Fragment } from "react";
import { useAppSelector } from "utils/react-redux-hooks";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";

const Nav = () => {
    const location = useLocation();

    const user = useAppSelector((state) => state.data);

    function getLinkStyle(path: string) {
        if (path === "/")
            return location.pathname === "/"
                ? "text-[color:var(--teal-general-color)]"
                : "hover:text-[color:var(--text-secondary-color)]";

        return location.pathname.startsWith(path)
            ? "text-[color:var(--teal-general-color)]"
            : "hover:text-[color:var(--text-secondary-color)]";
    }

    const options: DropdownOption[] = [
        {
            icon: "user-circle",
            lable: "Profile",
        },
        {
            icon: "moon",
            lable: "Display",
        },
        {
            icon: "sign-out-alt",
            lable: "Logout",
        },
    ];

    // For hiding nav bar in mobile view
    const { width } = useWindowDimensions();

    if (routesIgnoreNav.some((route) => location.pathname.startsWith(route))) {
        return null;
    }

    if (width && width <= MOBILE_BREAKPOINT) {
        return null;
    }

    return (
        <nav className="flex flex-row justify-around items-center p-2 nav-height drop-shadow-md z-50 bg-[color:var(--nav-bg-color)] border-b-[.5px] border-b-[color:var(--nav-border-color)]">
            {/* <div className="ml-24"> */}
            <div className="">
                <Link to="/">
                    <span className="font-extrabold text-[color:var(--teal-general-color)]">
                        LOGO
                    </span>
                </Link>
            </div>

            <div className="flex flex-row justify-between items-center w-96 font-bold">
                <Link className={getLinkStyle("/")} to="/">
                    Search
                </Link>
                <Link className={getLinkStyle("/discover")} to="/discover">
                    Discover
                </Link>
                <Link className={getLinkStyle("/feedback")} to="/feedback">
                    Feedback
                </Link>
            </div>

            <div className="flex items-center font-bold">
                {!user ? (
                    <span>
                        <Icon icon="right-to-bracket" />
                        &nbsp;&nbsp;
                        <Link
                            className="hover:text-[color:var(--text-secondary-color)]"
                            to="/login"
                        >
                            Login
                        </Link>
                        &nbsp;&nbsp;/&nbsp;&nbsp;
                        <Link
                            className="hover:text-[color:var(--text-secondary-color)]"
                            to="/signup"
                        >
                            Register
                        </Link>
                    </span>
                ) : (
                    <Fragment>
                        <Icon className="mr-3" icon="bell" size="xl" />
                        <Dropdown
                            menu={
                                <Fragment>
                                    <img
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white"
                                        src="https://i.ibb.co/59tcmyp/96263453-p0.png"
                                        alt="avatar"
                                    />
                                    <span className="ml-3 mr-1 font-bold">
                                        Mash
                                    </span>
                                    <Icon icon="angle-down" />
                                </Fragment>
                            }
                            options={options}
                        />
                    </Fragment>
                )}
            </div>
        </nav>
    );
};

export default Nav;
