import React from "react";
import { Link } from "react-router-dom";

import "theme/Nav.css";
import Icon from "./Icon";

const Nav = () => {
    return (
        <nav className="flex flex-row justify-around items-center p-2 nav-height z-50 bg-[color:var(--nav-bg-color)] border-b-[.5px] border-b-[color:var(--nav-border-color)]">
            <div>
                <Link to="/">
                    <span className="font-extrabold text-pink-500">LOGO</span>
                </Link>
            </div>

            <div className="flex flex-row justify-between items-center w-96 font-bold">
                <Link className="hover:border-b" to="/search">
                    Search
                </Link>
                <Link className="hover:border-b" to="/discussion">
                    Discover
                </Link>
                <Link className="hover:border-b" to="/feedback">
                    Feedback
                </Link>
            </div>

            <div className="font-bold">
                <Link to="/login">
                    <span className="font-bold">
                        <Icon icon="right-to-bracket" /> Login/Register
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default Nav;