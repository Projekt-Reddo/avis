import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";
import "theme/PageWrapper.css";

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
            className={`page-wrapper px-0 lg:px-32 2xl:px-52 ${
                width! >= MOBILE_BREAKPOINT ? "padding-nav" : " "
            } min-height-nav w-full ${className}`}
            style={{ ...style }}
        >
            {children}
        </div>
    );
};

export default PageWrapper;
