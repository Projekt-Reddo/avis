import { Fragment, FunctionComponent } from "react";

interface StepFormProps {
    clasName?: string;
    style?: any;
    currentStep: number;
    stepTitles: string[];
    stepContents: JSX.Element[];
}

const StepForm: FunctionComponent<StepFormProps> = ({
    clasName,
    style,
    currentStep,
    stepTitles,
    stepContents,
}) => {
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
                                className={`inline-block p-4 font-semibold pointer-events-none`}
                                // onClick={() => setCurrentStep(index)}
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
        </div>
    );
};

export default StepForm;
