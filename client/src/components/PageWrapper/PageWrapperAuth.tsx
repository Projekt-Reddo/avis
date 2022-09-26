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
            className={`page-wrapper w-screen min-h-screen flex flex-row flex-wrap ${className}`}
            style={{ ...style, overflowY: "scroll" }}
        >
            <div
                className="w-full lg:w-1/2 h-2/6 lg:h-full"
                style={{
                    backgroundImage: `url(${leftImage})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    aspectRatio: "1/1",
                }}
            ></div>
            <div className="w-full lg:w-1/2 lg:h-full">{rightContent}</div>
        </div>
    );
};

export default PageWrapperAuth;
