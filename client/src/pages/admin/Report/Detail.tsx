import CommentCard from "components/Comment/CommentCard";
import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";
import PostCard from "components/Post/PostCard";
import Loading from "components/shared/Loading";
import NotFound from "components/shared/NotFound";
import moment from "moment";
import { useEffect } from "react";
import { useParams } from "react-router";
import { getDetailAsync } from "store/slices/reportSlice";
import { DAY_FORMAT } from "utils/constants";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

interface RouteParams {
    id: string;
}

const Detail = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useAppDispatch();
    const reportState = useAppSelector((state) => state.report);

    useEffect(() => {
        if (id) {
            dispatch(getDetailAsync(id));
        }
    }, []);

    return (
        <PageWrapperWithLeftNav>
            <div className="flex justify-between pt-6">
                <div className="text-lg font-bold">Report detail</div>
            </div>

            {reportState.status === "loading" ? (
                // Loading Components
                <div className="flex justify-center items-center mt-8">
                    <Loading />
                </div>
            ) : reportState.status === "idle" &&
              reportState.data &&
              reportState.data.id ? (
                <>
                    <div className="bg-[color:var(--element-bg-color)] w-full grid grid-cols-6 p-4 mt-2 rounded-lg">
                        <div className="font-bold flex flex-col gap-2">
                            <p>From</p>
                            <p>Report Object</p>
                            <p>Report Type</p>
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                            <p>{reportState.data.user.name}</p>
                            <p>{reportState.data.post ? "Post" : "Comment"}</p>
                            <p>{reportState.data.type}</p>
                        </div>

                        <div className="font-bold flex flex-col gap-2">
                            <p>To</p>
                            <p>Created Date</p>
                            <p>Report Content</p>
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                            <p>
                                {reportState.data.post
                                    ? reportState.data.post.user.name
                                    : reportState.data.comment.user.name}
                            </p>
                            <p>
                                {moment(reportState.data.createdAt).format(
                                    DAY_FORMAT
                                )}
                            </p>
                            <p>{reportState.data.content}</p>
                        </div>

                        <div></div>
                    </div>

                    <div className="mt-4">
                        {reportState.data.post ? (
                            <PostCard
                                post={reportState.data.post}
                                isDetailPage={true}
                                style="drop-shadow-none"
                                hasOptions={false}
                            />
                        ) : (
                            <div className="bg-[color:var(--element-bg-color)] p-4 rounded-lg">
                                <CommentCard
                                    comment={reportState.data.comment}
                                    hasOptions={false}
                                />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <NotFound />
                </>
            )}
        </PageWrapperWithLeftNav>
    );
};

export default Detail;
