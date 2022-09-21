import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";
import "theme/PageWrapper.css";

interface PageWrapperProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    children?: React.ReactNode;
    className?: string;
    style?: any;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    className = "",
    style = {},
    ...props
}) => {
    const { width } = useWindowDimensions();

    return (
        <div
            className={`page-wrapper px-0 lg:px-32 2xl:px-52 ${
                width! > MOBILE_BREAKPOINT
                    ? "padding-nav"
                    : "padding-mobile-nav"
            } min-height-nav w-full ${className}`}
            style={{ ...style }}
            {...props}
        >
            {children}
        </div>
    );
};

export default PageWrapper;
