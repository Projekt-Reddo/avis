import { useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useWindowDimensions } from "utils/useWindowDimensions";
import { MOBILE_BREAKPOINT, routesIgnoreNav } from "utils/constants";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

import "theme/TabsNav.css";
import Icon from "./Icon";
import {
    setIsReadNotifyAsync,
    viewNotifyAsync,
} from "store/slices/notifySlice";

const TabsNav = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user.data);
    const notifys = useAppSelector((state) => state.notify);

    // For hiding bottom nav bar in desktop view
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (user) {
            dispatch(
                viewNotifyAsync({
                    page: 1,
                    size: 10,
                    filter: {},
                })
            );
        }
    }, [user]);

    if (routesIgnoreNav.some((route) => location.pathname.startsWith(route))) {
        return null;
    }

    if (width && width > MOBILE_BREAKPOINT) {
        return null;
    }

    return (
        <nav
            className={`${
                user?.role === "Admin"
                    ? "grid grid-cols-5 gap-3"
                    : "grid grid-cols-4 gap-4"
            }  fixed bg-[color:var(--body-bg-color)] bottom-nav-height min-w-full bottom-0 border-t`}
        >
            <Link
                to="/"
                className={
                    location.pathname === "/"
                        ? "tab-button-select"
                        : "tab-button"
                }
            >
                <Icon icon="house" className="text-2xl p-4" />
            </Link>

            <Link
                to="/discover"
                className={
                    location.pathname === "/discover"
                        ? "tab-button-select"
                        : "tab-button"
                }
            >
                <Icon
                    icon={
                        location.pathname === "/discover"
                            ? "compass"
                            : ["far", "compass"]
                    }
                    className="text-2xl p-4"
                />
            </Link>

            <div
                onClick={() => {
                    dispatch(setIsReadNotifyAsync());
                    history.push(`/user/notification`);
                }}
                className={
                    location.pathname === "/user/notification"
                        ? "tab-button-select cursor-pointer"
                        : "tab-button cursor-pointer"
                }
            >
                <div className="flex justify-center items-center p-4">
                    {notifys?.data?.payload?.filter(
                        (item: Notify) => item.isRead === false
                    ).length > 0 ? (
                        <div className="absolute flex justify-center items-center h-3 w-3 bg-[color:var(--red-darker-color)] font-bold rounded-full text-white text-[10px] ml-4 mb-6">
                            {notifys?.data?.payload?.filter(
                                (item: Notify) => item.isRead === false
                            ).length > 9
                                ? "9+"
                                : notifys?.data?.payload?.filter(
                                      (item: Notify) => item.isRead === false
                                  ).length}
                        </div>
                    ) : (
                        ""
                    )}
                    <Icon
                        icon={
                            location.pathname === "/user/notification"
                                ? "bell"
                                : ["far", "bell"]
                        }
                        className="text-2xl"
                    />
                </div>
            </div>

            <Link
                to={!user ? "/login" : "/user/profile"}
                className={
                    location.pathname === "/user/profile"
                        ? "tab-button-select"
                        : "tab-button"
                }
            >
                <Icon
                    icon={
                        location.pathname === "/user/profile"
                            ? "user-circle"
                            : ["far", "user-circle"]
                    }
                    className="text-2xl p-4"
                />
            </Link>

            {user?.role === "Admin" ? (
                <Link
                    to="/admin"
                    className={
                        location.pathname.startsWith("/admin")
                            ? "tab-button-select"
                            : "tab-button"
                    }
                >
                    <Icon icon="users-gear" className="text-2xl p-4" />
                </Link>
            ) : (
                " "
            )}
        </nav>
    );
};

export default TabsNav;
