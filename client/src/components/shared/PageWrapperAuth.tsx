interface PageWrapperAuthProps {
    children?: React.ReactNode;
    className?: string;
    style?: any;
    leftImage: string;
    rightContent: React.ReactNode;
}

const PageWrapperAuth: React.FC<PageWrapperAuthProps> = ({
    className = "",
    style = {},
    leftImage,
    rightContent,
}) => {
    return (
        <div
            className={`w-screen h-screen flex flex-row flex-wrap ${className}`}
            style={{ ...style }}
        >
            <div
                className="w-1/2 h-full"
                style={{
                    backgroundImage: `url(${leftImage})`,
                    backgroundSize: "cover",
                }}
            ></div>
            <div className="w-1/2 h-full">{rightContent}</div>
        </div>
    );
};

export default PageWrapperAuth;
