import Icon from "components/shared/Icon";
import { Link } from "react-router-dom";

interface LeftNavItemProps {
    itemData: LeftNavItemData;
    isActive: boolean;
}

const LeftNavItem: React.FC<LeftNavItemProps> = ({ itemData, isActive }) => {
    return (
        <Link
            className="w-full flex flex-row items-center rounded-lg p-3 pl-6 my-1 font-bold"
            style={isActive ? { background: "rgba(55, 63, 65, 0.1)" } : {}}
            to=""
        >
            <Icon icon={itemData.icon} className="pr-3" />
            <div>{itemData.title}</div>
        </Link>
    );
};

export default LeftNavItem;
