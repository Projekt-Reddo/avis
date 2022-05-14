import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { testUser } from "../store/slices/userSlice";

const Home = () => {
    const user = useSelector((state: any) => state.user);

    const dispatch = useDispatch();

    return (
        <div
            style={{
                paddingTop: 100,
            }}
        >
            <div className="text-3xl font-bold underline">Hello, {user}</div>
            <button
                className="btn"
                onClick={() => {
                    dispatch(testUser("Hosimati Suisei"));
                }}
            >
                lickme!
            </button>
        </div>
    );
};

export default Home;
