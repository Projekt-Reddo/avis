import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/shared/Button";
import Icon from "components/shared/Icon";
import { Dispatch, FunctionComponent } from "react";
import { FieldValues, useForm } from "react-hook-form";
import yup from "utils/yup-config";

interface ThumbnailInputProps {
    song: SongCreateDto;
    setSong: Dispatch<React.SetStateAction<SongCreateDto>>;
    currentStep?: number;
    nextFormStep: () => void;
    previousFormStep: () => void;
}

const ThumbnailInput: FunctionComponent<ThumbnailInputProps> = ({
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
            <div>Thumbnail form</div>
            {/* Form navigate btn */}
            <div className="col-span-6">
                <div className="flex flex-row justify-end mt-4">
                    <Button
                        type="submit"
                        className="mr-5 border-2 border-blue-500"
                        style={{
                            boxShadow: "none !important",
                        }}
                        variant="secondary"
                        onClick={previousFormStep}
                    >
                        <Icon icon="arrow-left" />
                        <span className="ml-2">Back</span>
                    </Button>
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

export default ThumbnailInput;

const schema = yup.object().shape({});
