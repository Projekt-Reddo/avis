import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";

interface PageWrapperProps {
    children?: React.ReactNode;
    className?: string;
    style?: any;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    className = "",
    style = {},
}) => {
    const { width } = useWindowDimensions();

    return (
        <div
            className={`${
                width! > MOBILE_BREAKPOINT
                    ? "padding-nav"
                    : "padding-mobile-nav"
            } min-height-nav w-full ${className}`}
            style={{ ...style }}
        >
            {children}
        </div>
    );
};

export default PageWrapper;
