import { useLocation } from "react-router";
import { toggleLeftNav } from "store/slices/leftNavSlice";
import { leftNavOptions } from "utils/constants";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

import "./left-nav.styles.css";
import LeftNavFloatingButton from "./LeftNav.FloatingButton";
import LeftNavItem from "./LeftNav.Item";

const LeftNav = () => {
    const location = useLocation();

    const isShowing = useAppSelector((state) => state.leftNavShowing);
    const auth = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const setIsShowing = () => dispatch(toggleLeftNav());

    let renderOptions = leftNavOptions[auth.data.role];

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
                            isActive={location.pathname.startsWith(item.path)}
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
