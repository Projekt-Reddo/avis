import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button/Button";
import FileDropzone from "components/shared/FileDropzone";
import Icon from "components/shared/Icon";
import { Dispatch, FunctionComponent } from "react";
import { FieldValues, useForm } from "react-hook-form";
import yup from "utils/yup-config";

interface TrackInputProps {
    song: SongCreate;
    setSong: Dispatch<React.SetStateAction<SongCreate>>;
    currentStep?: number;
    nextFormStep: () => void;
    previousFormStep: () => void;
}

const TrackInput: FunctionComponent<TrackInputProps> = ({
    song,
    setSong,
    currentStep,
    nextFormStep,
    previousFormStep,
}) => {
    const {
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: song,
    });

    const onSubmit = (values: FieldValues) => {
        setSong({ ...song, ...values });
        nextFormStep();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* From content */}
            <div
                className="flex items-center"
                style={{
                    minHeight: "22rem",
                }}
            >
                <FileDropzone
                    error={errors.file}
                    getValues={getValues}
                    setValue={setValue}
                />
            </div>

            {/* Form navigate btn */}
            <div className="">
                <div className="flex flex-row justify-end mt-4">
                    <Button
                        type="submit"
                        style={{
                            boxShadow: "none !important",
                        }}
                    >
                        <Icon icon="arrow-right" className="text-white" />
                        <span className="ml-2 text-white">Next</span>
                    </Button>
                </div>
            </div>
        </form>
    );
};

const schema = yup.object().shape({
    file: yup.mixed().required("Track is required!"),
});

export default TrackInput;
