import { Link, useLocation } from "react-router-dom";
import "theme/Nav.css";
import { routesIgnoreNav, THEME } from "utils/constants";
import Icon from "./Icon";
import Dropdown from "components/shared/Dropdown";
import { Fragment, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";
import { firebaseLogout } from "api/firebase-api";

import WHITE_IMG from "static/white.png";
import { getTheme, setTheme } from "store/slices/themeSlice";
import NotificationCard from "components/Notification/NotificationCard";
import { useOutsideClick } from "utils/useOutsideClick";
import {
    setIsReadNotifyAsync,
    viewNotifyAsync,
} from "store/slices/notifySlice";

const Nav = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.data);
    const authStatus = useAppSelector((state) => state.auth.status);
    const theme = useAppSelector((state) => state.theme);
    const notifys = useAppSelector((state) => state.notify);

    const [showNotification, setShowNotification] = useState(false);
    const notificationRef = useRef(null);
    useOutsideClick(notificationRef, () => {
        setShowNotification(false);
    });

    function getLinkStyle(path: string) {
        if (path === "/")
            return location.pathname === "/"
                ? "text-[color:var(--teal-general-color)]"
                : "hover:text-[color:var(--text-secondary-color)]";

        return location.pathname.startsWith(path)
            ? "text-[color:var(--teal-general-color)]"
            : "hover:text-[color:var(--text-secondary-color)]";
    }

    const displayThemeIcon = (): string => {
        if (theme.status === "idle") {
            switch (theme.data.display) {
                case THEME.DARK:
                    return "moon";

                case THEME.SYSTEM:
                    return "desktop";

                default:
                    return "sun";
            }
        }

        return "sun";
    };

    const options: DropdownOption[] = [
        {
            icon: "user-circle",
            lable: "Profile",
            to: "/user/profile",
        },
        {
            icon: displayThemeIcon(),
            lable: `Display: ${theme.data.display}`,
            onClick: () => {
                dispatch(setTheme(theme.data.display));
            },
            autoClose: false,
        },
        {
            icon: "bars-progress",
            lable: "Manage",
            to: user && user.role === "admin" ? "/admin" : "/moderator",
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

    useEffect(() => {
        dispatch(getTheme());
    }, []);

    useEffect(() => {
        dispatch(
            viewNotifyAsync({
                page: 1,
                size: 10,
                filter: {},
            })
        );
    }, [user]);

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

            <div className="flex flex-row justify-between items-center w-full font-bold">
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
                            data-cy="register-btn"
                        >
                            Register
                        </Link>
                    </span>
                ) : (
                    <Fragment>
                        <div ref={notificationRef}>
                            <button>
                                <div className="flex justify-center items-center p-4">
                                    {notifys?.data?.payload?.filter(
                                        (item: Notify) => item.isRead === false
                                    ).length > 0 ? (
                                        <div className="absolute flex justify-center items-center h-3 w-3 bg-[color:var(--red-darker-color)] font-bold rounded-full text-white text-[10px] ml-4 mb-6">
                                            {notifys?.data?.payload?.filter(
                                                (item: Notify) =>
                                                    item.isRead === false
                                            ).length > 9
                                                ? "9+"
                                                : notifys?.data?.payload?.filter(
                                                      (item: Notify) =>
                                                          item.isRead === false
                                                  ).length}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <Icon
                                        onClick={() => {
                                            dispatch(setIsReadNotifyAsync());
                                            setShowNotification(
                                                !showNotification
                                            );
                                        }}
                                        icon="bell"
                                        size="xl"
                                    />
                                </div>
                            </button>
                            {showNotification && (
                                <div className="absolute w-[20rem] mt-[0.5rem] ml-[-10.4rem]">
                                    <NotificationCard />
                                </div>
                            )}
                        </div>

                        <Dropdown
                            menu={
                                <Fragment>
                                    <img
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white mr-2"
                                        src={user.avatar || WHITE_IMG}
                                        alt="avatar"
                                        style={{
                                            objectFit: "cover",
                                        }}
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
