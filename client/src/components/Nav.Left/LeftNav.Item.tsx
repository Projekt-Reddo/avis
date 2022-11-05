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
            style={
                isActive ? { background: "var(--admin-nav-color-elevate)" } : {}
            }
            to={itemData.path}
        >
            <Icon icon={itemData.icon} className="left-nav-item-icon" />
            <div className={`left-nav-item-title ${isShowing ? "show" : ""}`}>
                {itemData.title}
            </div>
        </Link>
    );
};

export default LeftNavItem;
