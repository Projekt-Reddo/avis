import React, { useState } from "react";
import PageWrapper from "components/shared/PageWrapper";
import StepFrom from "components/Admin/Create/StepForm";
import TrackInput from "components/Admin/Create/TrackInput";
import InfoInput from "components/Admin/Create/InfoInput";
import ThumbnailInput from "components/Admin/Create/ThumbnailInput";
import UrlInput from "components/Admin/Create/UrlInput";
import LyricInput from "components/Admin/Create/LyricInput";
import { useAppDispatch } from "utils/react-redux-hooks";
import { createAsync } from "store/slices/songSlice";
import { FieldValues } from "react-hook-form";

const Create = () => {
    // document.title = "Create song";

    const [currentStep, setCurrentStep] = useState(0);
    const nextFormStep = () => setCurrentStep(currentStep + 1);
    const previousFormStep = () => setCurrentStep(currentStep - 1);

    const [songCreate, setSongCreate] = useState<SongCreate>({
        title: "",
        alias: "",
        thumbnail: null,
        lyric: "",
        description: "",
        genres: [],
        url: {
            soundcloud: "",
            spotify: "",
            youtube: "",
        },
        artistIds: [],
        file: null,
    });

    const dispatch = useAppDispatch();

    const handleCreate = () => {
        dispatch(createAsync(songCreate));
    };

    const stepTitles = ["Track", "Info", "Thumbnail", "Urls", "Lyric"];

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
        />,
        <UrlInput
            song={songCreate}
            setSong={setSongCreate}
            currentStep={currentStep}
            nextFormStep={nextFormStep}
            previousFormStep={previousFormStep}
        />,
        <LyricInput
            song={songCreate}
            setSong={setSongCreate}
            currentStep={currentStep}
            nextFormStep={handleCreate}
            previousFormStep={previousFormStep}
        />,
    ];

    return (
        <PageWrapper className="bg-[#F0F0F5]">
            <StepFrom
                clasName="mx-5 lg:mx-0"
                currentStep={currentStep}
                stepTitles={stepTitles}
                stepContents={stepContents}
            />
        </PageWrapper>
    );
};

export default Create;
