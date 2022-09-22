import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

const InDevelopment = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div>
                <div className="text-center text-6xl text-[color:var(--teal-lighter-color)]">
                    COMING SOON
                </div>
                <div className="text-center mt-4">
                    Reddo team members are currently working hard building this
                    page!
                    <div>
                        Donate and we will accomplish it immediately &#129297;
                    </div>
                </div>
                <div className="flex justify-center items-center gap-8 mt-8">
                    <Link to="/">
                        <button
                            className="font-bold text-[color:var(--white-color)] bg-[color:var(--teal-lighter-color)]"
                            style={{
                                boxSizing: "border-box",
                                borderRadius: 8,
                                padding: "0.75rem 2rem",
                                border: "1px solid var( --nav-border-color)",
                            }}
                        >
                            <Icon icon="arrow-left" /> Back to home
                        </button>
                    </Link>
                    <Link to="/">
                        <button
                            className="font-bold text-[color:var(--white-color)] bg-[color:var(--teal-lighter-color)]"
                            style={{
                                boxSizing: "border-box",
                                borderRadius: 8,
                                padding: "0.75rem 2rem",
                                border: "1px solid var( --nav-border-color)",
                            }}
                        >
                            Donate this way <Icon icon="arrow-right" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InDevelopment;
