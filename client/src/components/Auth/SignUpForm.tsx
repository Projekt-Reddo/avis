import * as React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import yup from "utils/yup-config";

import Input from "components/shared/Input";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { signupAsync } from "store/slices/authSlice";
import Button from "components/Button/Button";

interface SignUpFormProps {}

const SignUpForm: React.FunctionComponent<SignUpFormProps> = () => {
    const userState = useAppSelector((state) => state.auth);

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
                name: data.name.replace(/\s+/g, " ").trim(),
                email: data.email,
                password: data.password,
            } as UserSignup)
        );
    };

    return (
        <form
            className="w-full h-max md:mt-8"
            onSubmit={handleSubmit(handleSignup)}
        >
            <Input
                className="py-3 w-full"
                label="Name"
                placeholder="Please enter your name"
                register={register("name")}
                error={errors.name}
                data-cy="name"
            />
            <Input
                className="py-3 w-full"
                label="Email"
                placeholder="Please enter your Email"
                register={register("email")}
                error={errors.email}
                data-cy="email"
            />
            <Input
                className="py-3 w-full"
                label="Password"
                placeholder="Please enter your Password"
                register={register("password")}
                type="password"
                error={errors.password}
                data-cy="password"
            />
            <Button
                className="mt-2.5"
                type="submit"
                data-cy="submit-btn"
                disabled={
                    userState.status === "loading" ||
                    userState.status === "init"
                }
            >
                Sign Up
            </Button>
        </form>
    );
};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required!")
        .name("Please enter valid name without invalid special characters")
        .min(6, "Name must be minimum of 6 characters"),
    email: yup
        .string()
        .required("Email is required!")
        .email("Please input a correct email format!"),
    password: yup
        .string()
        .required("Password is required!")
        .password(
            "Password must be minimum of 6 characters and can only contains uppercase, lowercase, numeric letter and some special characters: !@#$%^&*_-"
        ),
});

export default SignUpForm;
