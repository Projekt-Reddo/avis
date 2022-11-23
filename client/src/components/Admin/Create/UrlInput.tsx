import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button/Button";
import Icon from "components/shared/Icon";
import Input from "components/shared/Input";
import { Dispatch, FunctionComponent } from "react";
import { FieldValues, useForm } from "react-hook-form";

import yup from "utils/yup-config";

interface UrlInputProps {
    song: SongCreate;
    setSong: Dispatch<React.SetStateAction<SongCreate>>;
    currentStep?: number;
    nextFormStep: () => void;
    previousFormStep: () => void;
}

const UrlInput: FunctionComponent<UrlInputProps> = ({
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
        <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div
                style={{
                    minHeight: "22rem",
                }}
            >
                <div className="grid grid-cols-6 gap-4 gap-y-14">
                    <div className="col-span-1">
                        <div className="flex flex-col items-center">
                            <Icon icon={["fab", "youtube"]} size="2xl" />
                            <label className="font-medium">Youtube</label>
                        </div>
                    </div>
                    <div className="col-span-5">
                        <Input
                            className="w-100 lg:w-4/5"
                            type="text"
                            register={register("url.youtube")}
                            error={errors.url?.youtube}
                            data-cy="create-song-youtube"
                        />
                    </div>

                    <div className="col-span-1">
                        <div className="flex flex-col items-center">
                            <Icon icon={["fab", "spotify"]} size="2xl" />
                            <label className="font-medium">Spotify</label>
                        </div>
                    </div>
                    <div className="col-span-5">
                        <Input
                            className="w-100 lg:w-4/5"
                            type="text"
                            register={register("url.spotify")}
                            error={errors.url?.spotify}
                            data-cy="create-song-spotify"
                        />
                    </div>

                    <div className="col-span-1">
                        <div className="flex flex-col items-center">
                            <Icon icon={["fab", "soundcloud"]} size="2xl" />
                            <label className="font-medium">SoundCloud</label>
                        </div>
                    </div>
                    <div className="col-span-5">
                        <Input
                            className="w-100 lg:w-4/5"
                            type="text"
                            register={register("url.soundcloud")}
                            error={errors.url?.soundcloud}
                            data-cy="create-song-soundcloud"
                        />
                    </div>
                </div>
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
                        <span
                            className="ml-2 text-white"
                            data-cy="next-step-btn"
                        >
                            Next
                        </span>
                    </Button>
                </div>
            </div>
        </form>
    );
};

const schema = yup.object().shape({
    "url.youtube": yup.string(),
    "url.spotify": yup.string(),
    "url.soundcloud": yup.string(),
});

export default UrlInput;
