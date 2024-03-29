import React, { useEffect, useState } from "react";
import StepFrom from "components/Admin/Create/StepForm";
import TrackInput from "components/Admin/Create/TrackInput";
import InfoInput from "components/Admin/Create/InfoInput";
import ThumbnailInput from "components/Admin/Create/ThumbnailInput";
import UrlInput from "components/Admin/Create/UrlInput";
import LyricsInput from "components/Admin/Create/LyricsInput";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { createAsync } from "store/slices/songSlice";
import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";

const initValue = {
    title: "",
    alias: "",
    thumbnailFile: null,
    lyrics: "",
    description: "",
    genres: [],
    url: {
        soundcloud: "",
        spotify: "",
        youtube: "",
    },
    artistIds: [],
    file: null,
};

const Create = () => {
    // document.title = "Create song";

    const [currentStep, setCurrentStep] = useState(0);
    const nextFormStep = () => setCurrentStep(currentStep + 1);
    const previousFormStep = () => setCurrentStep(currentStep - 1);

    const [songCreate, setSongCreate] = useState<SongCreate>(initValue);

    const dispatch = useAppDispatch();

    const handleCreate = () => {
        dispatch(createAsync(songCreate));
    };

    const songState = useAppSelector((state) => state.song); // Redirect when done

    useEffect(() => {
        if (songState.status === "idle") {
            setCurrentStep(0);
            setSongCreate(initValue);
        }
    }, [songState]);

    const stepTitles = ["Track", "Info", "Thumbnail", "Urls", "Lyrics"];

    const stepContents = [
        <TrackInput
            song={songCreate}
            setSong={setSongCreate}
            currentStep={currentStep}
            nextFormStep={nextFormStep}
            previousFormStep={previousFormStep}
        />,
        <InfoInput
            song={songCreate}
            setSong={setSongCreate}
            currentStep={currentStep}
            nextFormStep={nextFormStep}
            previousFormStep={previousFormStep}
        />,
        <ThumbnailInput
            song={songCreate}
            setSong={setSongCreate}
            currentStep={currentStep}
            nextFormStep={nextFormStep}
            previousFormStep={previousFormStep}
            isRequired={false}
        />,
        <UrlInput
            song={songCreate}
            setSong={setSongCreate}
            currentStep={currentStep}
            nextFormStep={nextFormStep}
            previousFormStep={previousFormStep}
        />,
        <LyricsInput
            song={songCreate}
            setSong={setSongCreate}
            currentStep={currentStep}
            nextFormStep={handleCreate}
            previousFormStep={previousFormStep}
        />,
    ];

    return (
        <PageWrapperWithLeftNav className="">
            <StepFrom
                clasName="mx-5 lg:mx-0 p-5 my-10"
                currentStep={currentStep}
                stepTitles={stepTitles}
                stepContents={stepContents}
            />
        </PageWrapperWithLeftNav>
    );
};

export default Create;
