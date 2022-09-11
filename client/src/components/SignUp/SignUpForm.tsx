import * as React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
<<<<<<< HEAD

import yup from "utils/yup-config";

import Input from "components/shared/Input";
import { useAppDispatch } from "utils/react-redux-hooks";
import { signupAsync } from "store/slices/userSlice";
import { hash } from "utils/helpers";
import Button from "components/shared/Button";
=======

import yup from "utils/yup-config";

import Input from "../SignUp/Input";
import { useAppDispatch } from "utils/react-redux-hooks";
import { signupAsync } from "store/slices/userSlice";
import { hash } from "utils/helpers";
>>>>>>> 40b2ea20e138669d2e891a87052d522b94ff9bc0

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

    const dispatch = useAppDispatch();

    const handleSignup = (data: FieldValues) => {
        dispatch(
            signupAsync({
                name: data.name,
                email: data.email,
                password: hash(data.password),
            } as UserSignup)
        );
    };

    return (
        <div className="flex flex-col justify-center text-black">
            <div className="flex flex-row justify-between py-10">
                <p className="font-bold text-4xl">Welcome to Hum2Song</p>
                <p className="text-3xl text-pink-500">Logo</p>
            </div>
            <form
                className="w-full h-max mt-8"
                onSubmit={handleSubmit(handleSignup)}
            >
                <Input
<<<<<<< HEAD
                    className="py-2 w-4/5"
=======
                    className="py-2"
>>>>>>> 40b2ea20e138669d2e891a87052d522b94ff9bc0
                    label="Name"
                    placeholder="Please enter your name"
                    register={register("name")}
                    error={errors.name}
                ></Input>
                <Input
<<<<<<< HEAD
                    className="py-2 w-4/5"
=======
                    className="py-2"
>>>>>>> 40b2ea20e138669d2e891a87052d522b94ff9bc0
                    label="Email"
                    placeholder="Please enter your Email"
                    register={register("email")}
                    error={errors.email}
                ></Input>
                <Input
<<<<<<< HEAD
                    className="py-2 w-4/5"
=======
                    className="py-2"
>>>>>>> 40b2ea20e138669d2e891a87052d522b94ff9bc0
                    label="Password"
                    placeholder="Please enter your Password"
                    register={register("password")}
                    type="password"
                    error={errors.password}
                ></Input>
<<<<<<< HEAD
                <Button className="mt-5" type="submit">
                    Sign Up
                </Button>
=======
                <button className="signUpButtonIon mt-5" type="submit">
                    Sign Up
                </button>
>>>>>>> 40b2ea20e138669d2e891a87052d522b94ff9bc0
            </form>
        </div>
    );
};

const schema = yup.object().shape({
    name: yup.string().required("Name is equired!"),
    email: yup
        .string()
        .required("Email is required!")
        .email("Please input a correct email format!"),
    password: yup
        .string()
        .required("Password is required!")
        .password(
            "Password must be minimum of 8 characters and can only contains uppercase, lowercase, numeric letter and some special characters: !@#$%^&*_-"
        ),
});

export default SignUpForm;
