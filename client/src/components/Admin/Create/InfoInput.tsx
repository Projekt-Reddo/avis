import { Dispatch, FunctionComponent } from "react";
import Input from "components/shared/Input";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "utils/yup-config";
import TextArea from "components/shared/TextArea";
import SelectAsync from "components/shared/SelectAsync";
import { recommendGenreApi } from "api/genre-api";
import Button from "components/shared/Button";
import Icon from "components/shared/Icon";

interface InfoInputProps {
    song: SongCreateDto;
    setSong: Dispatch<React.SetStateAction<SongCreateDto>>;
    currentStep?: number;
    nextFormStep: () => void;
    previousFormStep: () => void;
}

const InfoInput: FunctionComponent<InfoInputProps> = ({
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
        <form
            className="grid grid-cols-6 gap-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="col-span-1">
                <label className="font-medium">Title</label>
            </div>
            <div className="col-span-5">
                <Input
                    className="w-100 lg:w-4/5"
                    type="text"
                    register={register("title")}
                    error={errors.title}
                />
            </div>

            <div className="col-span-1">
                <label className="font-medium">Alias</label>
            </div>
            <div className="col-span-5">
                <Input
                    className="w-100 lg:w-4/5"
                    type="text"
                    register={register("alias")}
                    error={errors.alias}
                />
            </div>

            <div className="col-span-1">
                <label className="font-medium">Description</label>
            </div>
            <div className="col-span-5">
                <TextArea
                    className="w-100 lg:w-4/5"
                    rows={7}
                    register={register("description")}
                    error={errors.description}
                />
            </div>

            <div className="col-span-1">
                <label className="font-medium">Genre</label>
            </div>
            <div className="col-span-5">
                <SelectAsync
                    className="w-100 lg:w-4/5"
                    isMulti={true}
                    loadOptionsCallback={recommendGenreApi}
                    control={control}
                    controlName={"genres"}
                />
            </div>

            {/* Form navigate btn */}
            <div className="col-span-6">
                <div className="flex flex-row justify-end mt-4">
                    <Button
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

const schema = yup.object().shape({
    title: yup.string().required("Name is required!"),
    alias: yup.string(),
    description: yup.string(),
    genres: yup.array(),
});

export default InfoInput;
