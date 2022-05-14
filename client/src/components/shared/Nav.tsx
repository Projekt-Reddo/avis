import React from "react";
import { Link } from "react-router-dom";

import "theme/Nav.css";
import Icon from "./Icon";

const Nav = () => {
    return (
        <nav className="flex flex-row justify-around items-center p-2 nav-height z-50 bg-black">
            <div>
                <Link to="/">
                    <span className="font-bold text-pink-500">LOGO</span>
                </Link>
            </div>

            <div className="flex flex-row justify-between items-center w-96">
                <Link to="/search">Search</Link>
                <Link to="/discussion">Discover</Link>
                <Link to="/feedback">Feedback</Link>
            </div>

            <div className="">
                <Link to="/login">
                    <span className="font-medium">
                        <Icon icon="right-to-bracket" /> Login/Register
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default Nav;
