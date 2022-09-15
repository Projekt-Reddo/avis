import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/shared/Button";
import Icon from "components/shared/Icon";
import ImageDropzone from "components/shared/ImageDropzone";
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
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
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
        <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div
                className="flex flex-col lg:flex-row items-center justify-center"
                style={{
                    minHeight: "22rem",
                }}
            >
                <div className="w-full lg:w-1/2 mb-3 lg:mb-0 flex justify-center">
                    <span>
                        Select thumbnail for this song and then to Create the
                        song.
                    </span>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center">
                    <ImageDropzone
                        className="w-72 h-72"
                        getValues={getValues}
                        setValue={setValue}
                        error={errors.thumbnail}
                    />
                </div>
            </div>

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
                        onClick={() => {
                            previousFormStep();
                            setSong({ ...song, ...getValues() });
                        }}
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

const schema = yup.object().shape({
    thumbnail: yup.mixed().required(),
});
