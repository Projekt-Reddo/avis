import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/shared/Button";
import Icon from "components/shared/Icon";
import { Dispatch, FunctionComponent } from "react";
import { FieldValues, useForm } from "react-hook-form";
import yup from "utils/yup-config";

interface TrackInputProps {
    song: SongCreateDto;
    setSong: Dispatch<React.SetStateAction<SongCreateDto>>;
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
        register,
        handleSubmit,
        formState: { errors },
        control,
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
        <form
            className="grid grid-cols-6 gap-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>This is form submit</div>
            {/* Form navigate btn */}
            <div className="col-span-6">
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
    // title: yup.string().required("Name is required!"),
    // alias: yup.string(),
    // description: yup.string(),
    // genres: yup.array(),
});

export default TrackInput;
