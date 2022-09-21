import { useLeftNav } from "components/Nav.Left/left-nav-hooks";
import LeftNav from "components/Nav.Left/LeftNav";
import PageWrapper from "components/shared/PageWrapper";

const Feedback = () => {
    const leftNavProps = useLeftNav();

    return (
        <PageWrapper
            style={{
                paddingLeft: 0,
                paddingRight: 0,
            }}
            {...leftNavProps}
        >
            <LeftNav />
        </PageWrapper>
    );
};

export default Feedback;
