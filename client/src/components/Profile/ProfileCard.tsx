import React, { useEffect } from "react";

import Icon from "components/shared/Icon";

import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

import WALLPAPER_BG from "static/AyaFubiMi.png";

import "./Profile.css";
import { viewProfileAsync } from "store/slices/profileSlice";
import TextLoading from "components/SkeletonLoading/TextLoading";
import moment from "moment";
import ProfileEditButton from "../ProfileEdit/ProfileEditButton";
import { useParams } from "react-router";

interface ProfileCardProps {
    loading: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ loading }) => {
    const params: any = useParams();

    const dispatch = useAppDispatch();

    const profileState = useAppSelector((state) => state.profile);

    useEffect(() => {
        if (params && params.uid) {
            dispatch(viewProfileAsync(params.uid));
        } else {
            dispatch(viewProfileAsync());
        }
    }, []);

    const profile = profileState.data;

    return (
        <div className="lg:pt-4">
            <div className="card relative profile-wrapper">
                {/* Avatar */}
                {profileState.status === "init" ||
                profileState.status === "loading" ? (
                    <div className="profile-avatar absolute rounded-full border-4 border-white profile-bg-img-position bg-white flex flex-row items-center justify-center">
                        <svg
                            className="w-14 h-14 text-gray-200"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 640 512"
                        >
                            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                        </svg>
                    </div>
                ) : (
                    <div
                        className="profile-avatar absolute rounded-full border-4 border-white profile-bg-img-position"
                        style={{
                            backgroundImage: `url(${profile.avatar})`,
                            backgroundSize: "cover",
                        }}
                    ></div>
                )}

                <div className="w-full h-full flex flex-col items-center">
                    {/* Wallpaper */}
                    <div
                        className="w-full profile-bg-img-position profile-wallpaper lg:rounded-t-lg"
                        style={{
                            backgroundImage: `url(${WALLPAPER_BG})`,
                            backgroundSize: "cover",
                        }}
                    ></div>

                    {/* Profile Info */}
                    <div className="flex flex-row flex-wrap w-full p-6 pt-4">
                        {/* Profile Detail */}
                        <div className="profile-info-left w-1/2">
                            {profileState.status === "init" ||
                            profileState.status === "loading" ? (
                                <TextLoading row={3} />
                            ) : (
                                <>
                                    <div className="font-bold text-lg py-1">
                                        {profile.name}
                                    </div>
                                    <div className="py-1 text-gray-500">
                                        {profile.email}
                                    </div>
                                    <div className="py-1 text-gray-500">
                                        <Icon icon="calendar-days" />
                                        {"  Joined "}
                                        {moment(profile.joinedDate).format(
                                            "MMMM YYYY"
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right button */}
                        <div className="flex flex-row justify-end w-1/2">
                            {params && params.uid ? (
                                <></>
                            ) : (
                                <ProfileEditButton
                                    disabled={
                                        profileState.status === "init" ||
                                        profileState.status === "loading"
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
