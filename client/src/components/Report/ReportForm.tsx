import { FunctionComponent, useState } from "react";
import StepFrom from "components/Admin/Create/StepForm";
import Icon from "components/shared/Icon";
import Button from "components/Button/Button";
import TextArea from "components/shared/TextArea";
import {
    FieldError,
    FieldErrorsImpl,
    FieldValues,
    Merge,
    useForm,
    UseFormRegister,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "utils/yup-config";
import { REPORT_TYPE } from "utils/constants";
import { useAppDispatch } from "utils/react-redux-hooks";
import { createAsync } from "store/slices/reportSlice";

interface ReportFormProps {
    id: string;
    isPost: boolean;
    setOpenReport: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportForm: FunctionComponent<ReportFormProps> = ({
    id,
    isPost = true,
    setOpenReport,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const backToSelections = () => {
        setCurrentStep(0);
    };

    const schema = yup.object().shape({
        problem: yup.string().required("Problem description is required!"),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const dispatch = useAppDispatch();
    const handleSubmitReport = (reportType: string) => {
        var reportCreate: ReportCreate = {
            type: reportType,
            postId: isPost ? id : "",
            commentId: !isPost ? id : "",
        };

        if (reportType === REPORT_TYPE.SOMETHING_ELSE) {
            reportCreate.content = getValues("problem");
        }

        dispatch(createAsync(reportCreate));
        setOpenReport(false);
    };

    const stepContents = [
        <ProblemList setCurrentStep={setCurrentStep} />,
        <ReportNudity
            onSubmit={() => {
                handleSubmitReport(REPORT_TYPE.NUDITY);
            }}
            backToSelections={backToSelections}
        />,
        <ReportViolence
            onSubmit={() => {
                handleSubmitReport(REPORT_TYPE.VIOLENCE);
            }}
            backToSelections={backToSelections}
        />,
        <ReportSpam
            onSubmit={() => {
                handleSubmitReport(REPORT_TYPE.SPAM);
            }}
            backToSelections={backToSelections}
        />,
        <ReportHateSpeech
            onSubmit={() => {
                handleSubmitReport(REPORT_TYPE.HATE_SPEECH);
            }}
            backToSelections={backToSelections}
        />,
        <ReportTerrorism
            onSubmit={() => {
                handleSubmitReport(REPORT_TYPE.TERROISM);
            }}
            backToSelections={backToSelections}
        />,
        <ReportOther
            onSubmit={() => {
                handleSubmitReport(REPORT_TYPE.SOMETHING_ELSE);
            }}
            register={register}
            errors={errors}
            backToSelections={backToSelections}
            handleSubmit={handleSubmit}
        />,
    ];

    return (
        <StepFrom
            clasName="mx-5 lg:mx-0 bg-[color:var(--element-bg-color)]"
            currentStep={currentStep}
            stepContents={stepContents}
        />
    );
};

export default ReportForm;

interface ProblemListProps {
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const ProblemList: FunctionComponent<ProblemListProps> = ({
    setCurrentStep,
}) => {
    const reportTypes = [
        {
            name: "Nudity",
            onClick: () => {
                setCurrentStep(1);
            },
        },
        {
            name: "Violence",
            onClick: () => {
                setCurrentStep(2);
            },
        },
        {
            name: "Spam",
            onClick: () => {
                setCurrentStep(3);
            },
        },
        {
            name: "Hate Speech",
            onClick: () => {
                setCurrentStep(4);
            },
        },
        {
            name: "Terroism",
            onClick: () => {
                setCurrentStep(5);
            },
        },
        {
            name: "Something else",
            onClick: () => {
                setCurrentStep(6);
            },
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <p className="font-bold px-2">Please select a problem</p>
            <p className="text-sm px-2">
                If someone is in immediate danger, get help before reporting to
                us. Don't wait.
            </p>
            <div data-cy="report-types-list">
                {reportTypes.map((reportType) => (
                    <div
                        className="flex justify-between items-center p-2 rounded hover:bg-[color:var(--element-bg-color-elevate-2)] cursor-pointer"
                        onClick={reportType.onClick}
                        key={reportType.name}
                    >
                        <span>{reportType.name}</span>
                        <Icon icon="arrow-right" />
                    </div>
                ))}
            </div>
        </div>
    );
};

interface ReportNudityProps {
    onSubmit: () => void;
    backToSelections: () => void;
}

const ReportNudity: FunctionComponent<ReportNudityProps> = ({
    onSubmit,
    backToSelections,
}) => {
    const standards = [
        {
            title: "Sexual activity",
            example: "",
        },
        {
            title: "Offering or requesting sexual activity",
            example: "",
        },
        {
            title: "Female nipples (except breastfeeding, health and acts of protest)",
            example: "",
        },
        {
            title: "Nudity showing genitals",
            example: "",
        },
        {
            title: "Sexually explicit language",
            example: "",
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <p className="text-lg font-bold px-2">Nudity</p>
            <p className="px-2">
                We only remove content that goes against our Community
                Standards. We don't allow things like:
            </p>
            <ul className="list-disc list-inside px-2 flex flex-col gap-2 my-3">
                {standards.map((standards) => (
                    <li key={standards.title}>
                        {standards.title} <br />
                        <span className="text-sm">{standards.example}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between">
                <Button onClick={backToSelections} variant="secondary">
                    Back
                </Button>
                <ReportSubmitButton onSubmit={onSubmit} />
            </div>
        </div>
    );
};

interface ReportViolenceProps {
    onSubmit: () => void;
    backToSelections: () => void;
}

const ReportViolence: FunctionComponent<ReportViolenceProps> = ({
    onSubmit,
    backToSelections,
}) => {
    const standards = [
        {
            title: "A credible threat to commit violence",
            example:
                "For example, targeting a person and mentioning a specific weapon",
        },
        {
            title: "A dangerous person or organization",
            example: "For example, terrorism or a criminal organization",
        },
        {
            title: "Extreme graphic violence",
            example:
                "For example, glorifying violence or celebrating suffering",
        },
        {
            title: "Another kind of violence",
            example: "For example, disturbing images or something else",
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <p className="text-lg font-bold px-2">Violence</p>
            <p className="px-2">
                We only remove content that goes against our Community
                Standards. We don't allow things like:
            </p>
            <ul className="list-disc list-inside px-2 flex flex-col gap-2 my-3">
                {standards.map((standards) => (
                    <li key={standards.title}>
                        {standards.title} <br />
                        <span className="text-sm">{standards.example}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between">
                <Button onClick={backToSelections} variant="secondary">
                    Back
                </Button>
                <ReportSubmitButton onSubmit={onSubmit} />
            </div>
        </div>
    );
};

interface ReportSpamProps {
    onSubmit: () => void;
    backToSelections: () => void;
}

const ReportSpam: FunctionComponent<ReportSpamProps> = ({
    onSubmit,
    backToSelections,
}) => {
    const standards = [
        {
            title: "Buying, selling or giving away accounts, roles or permissions",
            example: "",
        },
        {
            title: "Encouraging people to engage with content under false pretences",
            example: "",
        },
        {
            title: "Directing people through the misleading use of links",
            example: "",
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <p className="text-lg font-bold px-2">Spam</p>
            <p className="px-2">
                We only remove content that goes against our Community
                Standards. We don't allow things like:
            </p>
            <ul className="list-disc list-inside px-2 flex flex-col gap-2 my-3">
                {standards.map((standards) => (
                    <li key={standards.title}>
                        {standards.title} <br />
                        <span className="text-sm">{standards.example}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between">
                <Button onClick={backToSelections} variant="secondary">
                    Back
                </Button>
                <ReportSubmitButton onSubmit={onSubmit} />
            </div>
        </div>
    );
};

interface ReportHateSpeechProps {
    onSubmit: () => void;
    backToSelections: () => void;
}

const ReportHateSpeech: FunctionComponent<ReportHateSpeechProps> = ({
    onSubmit,
    backToSelections,
}) => {
    const standards = [
        {
            title: "Violent or dehumanizing speech",
            example:
                "For example, comparing all people of a certain race to insects or animals",
        },
        {
            title: "Statements of inferiority, disgust or contempt",
            example:
                "For example, suggesting that all people of a certain gender are disgusting",
        },
        {
            title: "Slurs",
            example:
                "For example, using harmful racial stereotypes to insult someone",
        },
        {
            title: "Calls for exclusion or segregation",
            example:
                "For example, saying that people of a certain religion shouldn't be allowed to vote",
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <p className="text-lg font-bold px-2">Hate Speech</p>
            <p className="px-2">
                We only remove content that goes against our Community
                Standards. We don't allow things like:
            </p>
            <ul className="list-disc list-inside px-2 flex flex-col gap-2 my-3">
                {standards.map((standards) => (
                    <li key={standards.title}>
                        {standards.title} <br />
                        <span className="text-sm">{standards.example}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between">
                <Button onClick={backToSelections} variant="secondary">
                    Back
                </Button>
                <ReportSubmitButton onSubmit={onSubmit} />
            </div>
        </div>
    );
};

interface ReportTerrorismProps {
    onSubmit: () => void;
    backToSelections: () => void;
}

const ReportTerrorism: FunctionComponent<ReportTerrorismProps> = ({
    onSubmit,
    backToSelections,
}) => {
    const standards = [
        {
            title: "We remove content about any non-governmental group or person that engages in or supports planned acts of violence for political, religious or ideological reasons.",
            example: "",
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <p className="text-lg font-bold px-2">Terrorism</p>
            <p className="px-2">
                We only remove content that goes against our Community
                Standards. We don't allow things like:
            </p>
            <ul className="list-disc list-inside px-2 flex flex-col gap-2 my-3">
                {standards.map((standards) => (
                    <li key={standards.title}>
                        {standards.title} <br />
                        <span className="text-sm">{standards.example}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between">
                <Button onClick={backToSelections} variant="secondary">
                    Back
                </Button>
                <ReportSubmitButton onSubmit={onSubmit} />
            </div>
        </div>
    );
};

interface ReportSubmitButtonProps {
    onSubmit: () => void;
}

const ReportSubmitButton: React.FC<ReportSubmitButtonProps> = ({
    onSubmit,
}) => {
    return (
        <Button onClick={onSubmit} data-cy="report-submit-button">
            Submit
        </Button>
    );
};

interface ReportOtherProps {
    onSubmit: () => void;
    backToSelections: () => void;
    register: UseFormRegister<FieldValues>;
    errors: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    handleSubmit: any;
}

const ReportOther: FunctionComponent<ReportOtherProps> = ({
    onSubmit,
    backToSelections,
    register,
    errors,
    handleSubmit,
}) => {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-lg font-bold px-2">Something Else</p>
            <p className="px-2">
                We only remove content that goes against our Community
                Standards. We don't allow things like:
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextArea
                    register={register("problem")}
                    // @ts-ignore
                    error={errors.problem}
                    rows={6}
                    placeholder="What's your problem?"
                    data-cy="report-textarea"
                />
                <div className="flex justify-between">
                    <Button onClick={backToSelections} variant="secondary">
                        Back
                    </Button>
                    <Button type="submit" data-cy="report-submit-button">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};
