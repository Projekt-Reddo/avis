import img from "static/Not_found.png";

const NotFound = () => {
    return (
        <div className="w-full grid place-items-center">
            <img src={img} className="w-5/6" />
        </div>
    );
};

export default NotFound;
