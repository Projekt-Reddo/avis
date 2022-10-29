import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button/Button";
import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";
import Icon from "components/shared/Icon";
import ImageDropzone from "components/shared/ImageDropzone";
import Input from "components/shared/Input";
import { FieldValues, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import yup from "utils/yup-config";

const CreateArtist = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const handleCreateArtist = (data: FieldValues) => {
        console.log(data);
    };

    const history = useHistory();

    return (
        <PageWrapperWithLeftNav>
            <div className="mx-5 lg:mx-0 p-6 lg:p-14 my-10 bg-white rounded-lg flex flex-col">
                {/* Main Content */}
                <div className="w-full flex flex-row flex-wrap">
                    <div className="w-full lg:w-2/5">
                        <ImageDropzone
                            className="w-full aspect-square"
                            getValues={getValues}
                            setValue={setValue}
                            error={errors.thumbnailFile}
                        />
                    </div>

                    <form
                        className="w-full lg:w-3/5 flex flex-col items-center justify-center"
                        onSubmit={handleSubmit(handleCreateArtist)}
                    >
                        <Input
                            className="pt-5 lg:py-3 w-full lg:w-4/5"
                            label="Name"
                            placeholder="Please enter artist name"
                            register={register("name")}
                            error={errors.name}
                            isRequired={true}
                        />
                        <Input
                            className="pt-5 lg:py-3 w-full lg:w-4/5"
                            label="Alias"
                            placeholder="Please enter artist alias"
                            register={register("alias")}
                            error={errors.alias}
                        />
                    </form>
                </div>

                {/* Buttons */}
                <div className="w-full flex flex-row items-center justify-between mt-6">
                    <Button
                        variant="secondary"
                        onClick={() => history.goBack()}
                    >
                        <Icon icon="arrow-left" className="mr-3" /> Back
                    </Button>
                    <Button onClick={handleSubmit(handleCreateArtist)}>
                        Create
                    </Button>
                </div>
            </div>
        </PageWrapperWithLeftNav>
    );
};

export default CreateArtist;

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Name is equired!")
        .name("Please enter valid name without invalid special characters"),
    alias: yup.string().nullable(true),
});
