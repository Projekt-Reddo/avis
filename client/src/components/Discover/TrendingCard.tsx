import "theme/Discover.css";

interface TrendingCardProps {
    setState: any;
}

const TrendingCard: React.FC<TrendingCardProps> = ({ setState }) => {
    return (
        <>
            <div className="card mt-4">
                <div className="text-xl bold mb-4 px-2 pt-2">
                    Trending for you
                </div>

                <div>
                    <div className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2">
                        #Popular
                    </div>
                    <div className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2">
                        #Hot
                    </div>
                    <div className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2">
                        Your Favorite
                    </div>
                    <div className="cursor-pointer hover:bg-[color:var(--post-bg-hover-color)] px-4 py-2">
                        Random
                    </div>
                </div>
            </div>
            <div className="card mt-4 p-4">
                <div className="grid grid-cols-2">
                    <div>Help</div>

                    <div>
                        <div>About</div>
                        <div>Terms</div>
                        <div>Privacy Policy</div>
                    </div>
                </div>
                <div className="mt-4">@ Reddo Team 2022</div>
            </div>
        </>
    );
};

export default TrendingCard;
