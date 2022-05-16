import { IonInput } from "@ionic/react";
import "../theme/Discover.css";
import Icon from "./shared/Icon";

interface SearchBoxProps {}

const SearchBox: React.FC<SearchBoxProps> = () => {
    return (
        <div className="card flex mb-6 px-2">
            <div className="flex justify-center items-center">
                <Icon icon="search" color="rgba(30, 155, 240, 0.5)" />
            </div>
            <IonInput placeholder="Search" />
        </div>
    );
};

export default SearchBox;
