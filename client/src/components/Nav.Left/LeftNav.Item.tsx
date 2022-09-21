import Icon from "components/shared/Icon";
import { Link } from "react-router-dom";

interface LeftNavItemProps {
    itemData: LeftNavItemData;
    isActive: boolean;
    isShowing: boolean;
}

const LeftNavItem: React.FC<LeftNavItemProps> = ({
    itemData,
    isActive,
    isShowing,
}) => {
    return (
        <Link
            className={`left-nav-item flex flex-row items-center rounded-lg my-1 font-bold ${
                isShowing ? "show" : ""
            }`}
            style={isActive ? { background: "rgba(55, 63, 65, 0.1)" } : {}}
            to={itemData.path}
        >
            <Icon
                icon={itemData.icon}
                className={
                    isShowing
                        ? "left-nav-item-icon pr-3"
                        : "left-nav-item-icon p-0"
                }
            />
            <div className={`left-nav-item-title ${isShowing ? "show" : ""}`}>
                {itemData.title}
            </div>
        </Link>
    );
};

export default LeftNavItem;
