import { Link } from "react-router-dom";

const AuthHeader = () => {
    return (
        <div className="w-full flex flex-row items-center justify-between">
            <h3 className="font-bold text-2xl lg:text-4xl">Welcome to Avis</h3>
            <Link className="text-[color:var(--teal-general-color)]" to="/">
                <img src="/assets/icon/icon.png" width={48} height={48} />
            </Link>
        </div>
    );
};

export default AuthHeader;
