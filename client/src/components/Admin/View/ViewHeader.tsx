import Icon from "components/shared/Icon";
import { Link } from "react-router-dom";

interface ViewHeaderProps {
    title: string;
    addButtonUrl: string;
}

const ViewHeader: React.FC<ViewHeaderProps> = ({ title, addButtonUrl }) => {
    return (
        <div className="flex justify-between pt-6">
            <div className="text-lg font-bold">{title}</div>
            <Link to={addButtonUrl}>
                <div
                    className="h-9 w-9 flex justify-center items-center text-[color:var(--teal-lighter-color)] bg-[color:var(--body-bg-color)]"
                    style={{
                        borderRadius: "50%",
                        border: "3px solid var(--teal-lighter-color)",
                    }}
                >
                    <Icon icon="plus" />
                </div>
            </Link>
        </div>
    );
};

export default ViewHeader;
