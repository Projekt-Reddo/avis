import Button from "components/shared/Button";
import Icon from "components/shared/Icon";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";

interface LeftNavFloatingButtonProps {
    isShowing: boolean;
    setIsShowing: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftNavFloatingButton: React.FC<LeftNavFloatingButtonProps> = ({
    isShowing,
    setIsShowing,
}) => {
    const { width } = useWindowDimensions();

    if (width && width < MOBILE_BREAKPOINT) return <></>;

    return (
        <Button
            variant="white"
            className="rounded-full"
            style={{
                position: "absolute",
                right: "-1rem",
                width: "2rem",
                height: "2rem",
                padding: "0.25rem",
                top: "calc(var(--nav-height) + 1rem)",
            }}
            onClick={() => setIsShowing(!isShowing)}
        >
            <Icon icon={isShowing ? "angle-left" : "angle-right"} />
        </Button>
    );
};

export default LeftNavFloatingButton;
