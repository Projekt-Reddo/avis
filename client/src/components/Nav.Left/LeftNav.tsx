import { useLocation } from "react-router";
import { toggleLeftNav } from "store/slices/leftNavSlice";
import { setTheme } from "store/slices/themeSlice";
import { displayThemeIcon, leftNavOptions } from "utils/leftNavData";
import { handleLogout } from "utils/logout";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

import "./left-nav.styles.css";
import LeftNavFloatingButton from "./LeftNav.FloatingButton";
import LeftNavItem from "./LeftNav.Item";

const LeftNav = () => {
    const location = useLocation();

    const isShowing = useAppSelector((state) => state.leftNavShowing);
    const auth = useAppSelector((state) => state.auth.data);
    const theme = useAppSelector((state) => state.theme);

    const dispatch = useAppDispatch();
    const setIsShowing = () => dispatch(toggleLeftNav());

    const leftNavUser: LeftNavItemData[] = [
        {
            icon: "user-circle",
            title: "Profile",
            path: "/user/profile",
        },
        {
            icon: "bars-progress",
            title: "Manage",
            path:
                auth && auth.role === "admin"
                    ? "/admin/user"
                    : "/moderator/user",
            isShown:
                auth && (auth.role === "admin" || auth.role === "moderator"),
        },
        {
            icon: displayThemeIcon(theme),
            title: `Display: ${theme.data.display}`,
            onClick: () => {
                dispatch(setTheme(theme.data.display));
            },
        },
        {
            icon: "sign-out-alt",
            title: "Logout",
            onClick: handleLogout,
        },
    ];

    let renderOptions = location.pathname.startsWith("/user")
        ? leftNavUser
        : leftNavOptions[auth.role];

    return (
        <nav
            className={`left-nav left-nav-border flex flex-col justify-evenly ${
                isShowing ? "show" : ""
            }`}
        >
            <LeftNavFloatingButton
                isShowing={isShowing}
                setIsShowing={setIsShowing}
            />
            <div className="w-full flex flex-col">
                {renderOptions.map((item) => {
                    return (
                        <LeftNavItem
                            key={item.title}
                            itemData={item}
                            isActive={location.pathname.startsWith(
                                item?.path || "never active"
                            )}
                            isShowing={isShowing}
                        />
                    );
                })}
            </div>
            <div></div>
        </nav>
    );
};

export default LeftNav;
