import { IonButton } from "@ionic/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import yup from "utils/yup-global";

import Input from "../SignUp/Input";

interface SignUpFormProps {}

const SignUpForm: React.FunctionComponent<SignUpFormProps> = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    return (
        <div className="flex flex-col justify-center text-black">
            <div className="flex flex-row justify-between py-10">
                <p className="font-bold text-4xl">Welcome to Hum2Song</p>
                <p className="text-3xl text-pink-500">Logo</p>
            </div>
            <form
                className="w-full h-max mt-8"
                onSubmit={handleSubmit((data) => {
                    console.log(data);
                })}
            >
                <Input
                    className="py-2"
                    label="Name"
                    placeholder="Please enter your name"
                    register={register("name")}
                ></Input>
                <Input
                    className="py-2"
                    label="Email"
                    placeholder="Please enter your Email"
                    register={register("email")}
                ></Input>
                <Input
                    className="py-2"
                    label="Password"
                    placeholder="Please enter your Password"
                    register={register("password")}
                    type="password"
                ></Input>
                <IonButton className="signUpButtonIon mt-5" type="submit">
                    Sign Up
                </IonButton>
            </form>
        </div>
    );
};

const schema = yup.object().shape({
    name: yup.string().required("Required"),
    email: yup
        .string()
        .required("Required")
        .email("Email is invalid"),
    password: yup
        .string()
        .required("Required")
        .password("Password is invalid"),
});

export default SignUpForm;
