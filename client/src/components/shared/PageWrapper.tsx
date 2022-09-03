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
    return (
        <div
            className={`padding-nav min-height-nav w-full ${className}`}
            style={{ ...style }}
        >
            {children}
        </div>
    );
};

export default PageWrapper;
