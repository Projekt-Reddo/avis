import InfoInput from "components/Admin/Create/InfoInput";
import LyricsInput from "components/Admin/Create/LyricsInput";
import ThumbnailInput from "components/Admin/Create/ThumbnailInput";
import UrlInput from "components/Admin/Create/UrlInput";
import StepFrom from "components/Admin/Create/StepForm";
import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";
import Loading from "components/shared/Loading";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { editAsync, songDetailAsync } from "store/slices/songSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

interface RouteParams {
    id: string;
}

const Edit = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useAppDispatch();
    const songState = useAppSelector((state) => state.song);

    useEffect(() => {
        if (id) {
            dispatch(songDetailAsync(id));
        }
    }, [id]);

    const [currentStep, setCurrentStep] = useState(0);
    const nextFormStep = () => setCurrentStep(currentStep + 1);
    const previousFormStep = () => setCurrentStep(currentStep - 1);

    const [songEdit, setSongEdit] = useState<SongCreate>(null!);
    useEffect(() => {
        if (
            songState.status === "idle" &&
            songState.data.hasOwnProperty("title")
        ) {
            setSongEdit(songState.data);
        }

        if (songState.status === "idle") {
            setCurrentStep(0);
        }
    }, [songState]);
    const handleEdit = () => {
        dispatch(editAsync(songEdit));
    };

    const stepTitles = ["Info", "Thumbnail", "Urls", "Lyrics"];
    const stepContents = [
        <InfoInput
            song={songEdit}
            setSong={setSongEdit}
            currentStep={currentStep}
            nextFormStep={nextFormStep}
        />,
        <ThumbnailInput
            song={songEdit}
            setSong={setSongEdit}
            currentStep={currentStep}
            nextFormStep={nextFormStep}
            previousFormStep={previousFormStep}
            isRequired={false}
        />,
        <UrlInput
            song={songEdit}
            setSong={setSongEdit}
            currentStep={currentStep}
            nextFormStep={nextFormStep}
            previousFormStep={previousFormStep}
        />,
        <LyricsInput
            song={songEdit}
            setSong={setSongEdit}
            currentStep={currentStep}
            nextFormStep={handleEdit}
            previousFormStep={previousFormStep}
        />,
    ];

    return (
        <PageWrapperWithLeftNav className="bg-[#F0F0F5]">
            {songState.status !== "idle" || !songEdit ? (
                <div className="w-full h-full flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                <StepFrom
                    clasName="mx-5 lg:mx-0"
                    currentStep={currentStep}
                    stepTitles={stepTitles}
                    stepContents={stepContents}
                />
            )}
        </PageWrapperWithLeftNav>
    );
};

export default Edit;
