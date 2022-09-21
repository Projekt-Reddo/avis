import "theme/Discover.css";

interface TrendingCardProps {}

const TrendingCard: React.FC<TrendingCardProps> = () => {
    return (
        <div className="card mb-6 p-4">
            <div className="text-xl bold mb-5">Trending for you</div>

            <div>
                <div>#Popular</div>
                <div>#Hot</div>
                <div>Your Favorite</div>
                <div>Random</div>
            </div>
        </div>
    );
};

export default TrendingCard;
