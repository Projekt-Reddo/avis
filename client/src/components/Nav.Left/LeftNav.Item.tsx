import Icon from "components/shared/Icon";
import { Link, useHistory } from "react-router-dom";

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
    const history = useHistory();

    if (itemData.isShown === false) return <></>;

    return (
        <div
            className={`left-nav-item flex flex-row items-center rounded-lg my-1 font-bold cursor-pointer ${
                isShowing ? "show" : ""
            }`}
            style={
                isActive ? { background: "var(--admin-nav-color-elevate)" } : {}
            }
            data-cy={itemData.title}
            onClick={() => {
                if (itemData.path) {
                    history.push(itemData.path);
                }

                if (itemData.onClick) {
                    itemData.onClick();
                }
            }}
        >
            <Icon icon={itemData.icon} className="left-nav-item-icon" />
            <div className={`left-nav-item-title ${isShowing ? "show" : ""}`}>
                {itemData.title}
            </div>
        </div>
    );
};

export default LeftNavItem;
