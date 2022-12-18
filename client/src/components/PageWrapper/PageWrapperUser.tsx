import { useLeftNav } from "components/Nav.Left";
import LeftNav from "components/Nav.Left/LeftNav";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useAppSelector } from "utils/react-redux-hooks";
import { useWindowDimensions } from "utils/useWindowDimensions";
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

const PageWrapperUser: React.FC<PageWrapperWithLeftNavProps> = ({
    children,
    className,
    ...props
}) => {
    const leftNavProps = useLeftNav();

    const { width } = useWindowDimensions();

    const authData = useAppSelector((state) => state.auth.data);

    return (
        <PageWrapper {...props} {...leftNavProps}>
            {authData && width && width <= MOBILE_BREAKPOINT && <LeftNav />}
            {children}
        </PageWrapper>
    );
};

export default PageWrapperUser;
