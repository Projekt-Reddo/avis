import backgroundImage from "static/Flat_art_verify_email.png";
import PageWrapperAuth from "components/PageWrapper/PageWrapperAuth";
import Button from "components/Button/Button";
import Input from "components/shared/Input";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "utils/yup-config";
import { useState } from "react";
import { resetPassword } from "api/firebase-api";
import { addNewToast } from "components/Toast";
import { mapAuthCodeToMessage } from "utils/firebase/firebase-helpers";

const ForgotPassword = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "fullfilled">(
        "idle"
    );

    // Form init
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    // HandleSubmit
    const handleSubmitForm = (data: FieldValues) => {
        setStatus("loading");

        resetPassword(data.email)
            .then(() => {
                setStatus("fullfilled");
            })
            .catch((e) => {
                addNewToast({
                    variant: "danger",
                    message: mapAuthCodeToMessage(e.code),
                });

                setStatus("idle");
            });
    };

    return (
        <PageWrapperAuth
            leftImage={backgroundImage}
            rightContent={
                <div className="h-full p-10 flex flex-col justify-center items-center">
                    {status === "fullfilled" ? (
                        <div>
                            <h3
                                className="font-bold text-2xl"
                                data-cy="email-verify"
                            >
                                Reset Password
                            </h3>
                            <div className="text-lg md:mt-2">
                                We sent a reset password link to your email
                                address, please check it!
                            </div>
                            <div className="mt-4 ">
                                <Button
                                    onClick={() => {
                                        window.location.replace("/login");
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-4/5">
                            <h3
                                className="font-bold text-2xl"
                                data-cy="email-verify"
                            >
                                Reset Password
                            </h3>
                            <form
                                className="w-full h-max md:mt-3"
                                onSubmit={handleSubmit(handleSubmitForm)}
                            >
                                <Input
                                    className="py-3 w-full"
                                    label="Please enter your email to retrieve password"
                                    placeholder="Please enter your Email"
                                    register={register("email")}
                                    error={errors.email}
                                    data-cy="email"
                                />
                                <Button
                                    className="mt-2.5 block"
                                    type="submit"
                                    disabled={status === "loading"}
                                    data-cy="submit-btn"
                                >
                                    Login
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            }
        />
    );
};

const schema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required!")
        .email("Please input a correct email format!"),
});

export default ForgotPassword;
