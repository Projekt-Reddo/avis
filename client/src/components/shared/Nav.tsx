import { Link, useLocation } from "react-router-dom";
import "theme/Nav.css";
import { routesIgnoreNav } from "utils/constants";
import Icon from "./Icon";
import Dropdown from "components/shared/Dropdown";
import { Fragment } from "react";
import { useAppSelector } from "utils/react-redux-hooks";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";
import { firebaseLogout } from "api/firebase-api";

import WHITE_IMG from "static/white.png";

const Nav = () => {
    const location = useLocation();

    const user = useAppSelector((state) => state.auth.data);
    const authStatus = useAppSelector((state) => state.auth.status);

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
            to: "/user/profile",
        },
        {
            icon: "moon",
            lable: "Display",
        },
        {
            icon: "bars-progress",
            lable: "Manage",
            to: "/admin",
            isShow:
                user && (user.role === "admin" || user.role === "moderator"),
        },
        {
            icon: "sign-out-alt",
            lable: "Logout",
            onClick: handleLogout,
        },
    ];

    function handleLogout() {
        firebaseLogout().then(() => window.location.reload());
    }

    /**
     * Render
     */
    // For hiding nav bar in mobile view
    const { width } = useWindowDimensions();

    if (routesIgnoreNav.some((route) => location.pathname.startsWith(route))) {
        return null;
    }

    if (width && width <= MOBILE_BREAKPOINT) {
        return null;
    }

    return (
        // <nav className="flex flex-row justify-around items-center p-2 nav-height drop-shadow-md z-nav bg-[color:var(--nav-bg-color)] border-b-[.5px] border-b-[color:var(--nav-border-color)]">
        <nav className="grid grid-cols-3 py-2 px-0 lg:px-32 2xl:px-52 nav-height drop-shadow-md z-nav bg-[color:var(--nav-bg-color)] border-b-[.5px] border-b-[color:var(--nav-border-color)]">
            <div className="flex items-center">
                <Link to="/">
                    <img
                        className="inline-block h-9 w-9 rounded-full"
                        src="/assets/icon/favicon.png"
                        alt="logo"
                    />
                </Link>
            </div>

            <div className="flex flex-row justify-between items-center w-96 font-bold">
                <Link className={getLinkStyle("/")} to="/">
                    Home
                </Link>
                <Link className={getLinkStyle("/discover")} to="/discover">
                    Discover
                </Link>
                <Link className={getLinkStyle("/feedback")} to="/feedback">
                    Feedback
                </Link>
            </div>

            <div className="flex items-center justify-end font-bold">
                {authStatus === "init" || authStatus === "loading" ? (
                    <></>
                ) : !user ? (
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
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white mr-2"
                                        src={user.avatar || WHITE_IMG}
                                        alt="avatar"
                                    />
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
