import { Fragment, FunctionComponent, useState } from "react";
import TrackInput from "components/Admin/Create/TrackInput";
import InfoInput from "components/Admin/Create/InfoInput";
import ThumbnailInput from "components/Admin/Create/ThumbnailInput";
import UrlInput from "components/Admin/Create/UrlInput";
import LyricInput from "components/Admin/Create/LyricInput";
import ArtistsInput from "components/Admin/Create/ArtistsInput";

interface StepFormProps {
    clasName?: string;
    style?: any;
}

const StepForm: FunctionComponent<StepFormProps> = ({ clasName, style }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const nextFormStep = () => setCurrentStep(currentStep + 1);
    const previousFormStep = () => setCurrentStep(currentStep - 1);

    const [songCreate, setSongCreate] = useState<SongCreateDto>({
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

    const stepTitles = [
        "Track",
        "Info",
        "Thumbnail",
        "Urls",
        "Lyric",
        "Artists",
    ];

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
            nextFormStep={nextFormStep}
            previousFormStep={previousFormStep}
        />,
        <ArtistsInput />,
    ];

    return (
        <div
            className={`bg-[color:var(--element-bg-color)] rounded-lg p-5 mt-10 ${clasName}`}
            style={{ ...style }}
        >
            <div className="mb-6">
                <ul className="flex flex-wrap -mb-px text-center">
                    {stepTitles.map((title, index) => (
                        <li
                            key={title}
                            className={`mx-5 ${
                                currentStep === index
                                    ? "rounded-t-lg border-b-4 border- border-[color:var(--teal-general-color)]"
                                    : ""
                            }`}
                        >
                            <button
                                className={`inline-block p-4 font-semibold`}
                                onClick={() => setCurrentStep(index)}
                            >
                                {title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {stepContents.map((content, index) =>
                    currentStep === index ? (
                        <div
                            key={"st" + index}
                            className="px-2 lg:px-9 max-h-fit"
                        >
                            {content}
                        </div>
                    ) : (
                        <Fragment key={"st" + index}></Fragment>
                    )
                )}
            </div>
            {/* <div className="flex flex-row justify-end mt-4">
                {currentStep > 0 && (
                    <Button
                        className="mr-5 border-2 border-blue-500"
                        style={{
                            boxShadow: "none !important",
                        }}
                        variant="secondary"
                        onClick={() => setCurrentStep(currentStep - 1)}
                    >
                        <Icon icon="arrow-left" />
                        <span className="ml-2">Back</span>
                    </Button>
                )}
                {currentStep < stepContents.length - 1 && (
                    <Button
                        style={{
                            boxShadow: "none !important",
                        }}
                        onClick={() => setCurrentStep(currentStep + 1)}
                    >
                        <Icon icon="arrow-right" className="text-white" />
                        <span className="ml-2 text-white">Next</span>
                    </Button>
                )}
                {currentStep === stepContents.length - 1 && (
                    <Button
                        className=""
                        style={{
                            boxShadow: "none !important",
                        }}
                        onClick={() => setCurrentStep(currentStep + 1)}
                    >
                        <Icon icon="arrow-right" className="text-white" />
                        <span className="ml-2 text-white">Submit</span>
                    </Button>
                )}
            </div> */}
        </div>
    );
};

export default StepForm;
