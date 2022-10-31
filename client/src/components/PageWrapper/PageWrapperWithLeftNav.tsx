import { useLeftNav } from "components/Nav.Left";
import LeftNav from "components/Nav.Left/LeftNav";
import { useAppSelector } from "utils/react-redux-hooks";
import PageWrapper from "./PageWrapper";

interface PageWrapperWithLeftNavProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    children?: React.ReactNode;
    className?: string;
    style?: any;
}

const PageWrapperWithLeftNav: React.FC<PageWrapperWithLeftNavProps> = ({
    children,
    className,
    ...props
}) => {
    const leftNavProps = useLeftNav();

    const isShowing = useAppSelector((state) => state.leftNavShowing);

    return (
        <PageWrapper
            {...props}
            {...leftNavProps}
            className={`page-wrapper-left-nav bg-[#F0F0F5] ${
                isShowing ? "show" : ""
            } ${className}`}
        >
            <LeftNav />
            {children}
        </PageWrapper>
    );
};

export default PageWrapperWithLeftNav;
