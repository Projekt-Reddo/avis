//Libs
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { viewMoreNotifyAsync } from "store/slices/notifySlice";

// Components
import Loading from "components/shared/Loading";
import Icon from "components/shared/Icon";

// Constants
import { useWindowDimensions } from "utils/useWindowDimensions";
import { MOBILE_BREAKPOINT } from "utils/constants";

//Styles
import "./NotificationCard.css";

interface NotificationCardProps {}

const NotificationCard: React.FC<NotificationCardProps> = () => {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.data);
    const notifys = useAppSelector((state) => state.notify);

    const { width, height } = useWindowDimensions();

    const [fetchMorePage, setFetchMorePage] = useState(2);

    const fetchData = () => {
        dispatch(
            viewMoreNotifyAsync({
                page: fetchMorePage,
                size: 10,
                filter: {},
            })
        );
        setFetchMorePage(fetchMorePage + 1);
    };

    return (
        <div className="notification-section lg:drop-shadow-md py-4">
            <div className="font-bold text-2xl lg:text-xl px-4">
                Notifications
            </div>

            {notifys.status === "loading" ||
            notifys.status === "init" ||
            !notifys.data ||
            (notifys.status === "idle" &&
                !Object.hasOwn(notifys.data, "payload")) ? (
                // Loading
                <div className="flex justify-center items-center mt-8">
                    <Loading />
                </div>
            ) : notifys.status === "error" ? (
                // Error
                <div className="flex justify-center items-center mt-8 text-lg">
                    <div>{notifys.status}</div>
                </div>
            ) : notifys.data.payload.length === 0 ? (
                <div className="flex justify-center items-center font-bold mb-2 mt-4">
                    You don't have any notification
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={notifys.data.payload.length}
                    next={fetchData}
                    hasMore={
                        notifys.data.total - notifys.data.payload.length > 0
                    }
                    loader={
                        // Loading
                        <div className="flex justify-center items-center my-2">
                            <Loading />
                        </div>
                    }
                    endMessage={
                        <div className="flex justify-center items-center font-bold mt-2">
                            Nice work, you're all caught up!
                        </div>
                    }
                    className="scrollable-notifi"
                    height={width! > MOBILE_BREAKPOINT ? 480 : height! - 128}
                >
                    <div className="pt-4">
                        {notifys.data.payload.map((notify: any) => (
                            // Notification Item
                            <div
                                key={notify.id}
                                className="notification-item grid grid-cols-6 p-2"
                            >
                                <div className="flex justify-center items-center col-span-1">
                                    {moment().diff(
                                        moment(notify.isReadAt),
                                        "minutes"
                                    ) < 1 ? (
                                        <Icon
                                            icon="circle"
                                            className="text-[color:var(--teal-general-color)] text-xs"
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="col-span-5">
                                    <div className="text-base font-bold">
                                        Dear {user.displayName}
                                    </div>
                                    <div className="text-sm font-light">
                                        {notify.message}
                                    </div>
                                    <div className="text-xs text-[color:var(--text-tertiary-color)] pt-1">
                                        {moment(notify.createdAt).fromNow()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            )}
        </div>
    );
};

export default NotificationCard;
