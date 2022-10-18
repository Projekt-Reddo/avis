import * as React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import yup from "utils/yup-config";

import Input from "components/shared/Input";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { loginAsync } from "store/slices/authSlice";
import { hash } from "utils/helpers";
import Button from "components/Button/Button";
import { Link } from "react-router-dom";

interface LoginFormProps {}

const LoginForm: React.FunctionComponent<LoginFormProps> = () => {
    // Handle loading
    const userState = useAppSelector((state) => state.auth);

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
    const dispatch = useAppDispatch();
    const handleSubmitForm = (data: FieldValues) => {
        dispatch(
            loginAsync({
                email: data.email,
                password: hash(data.password),
            } as UserLoginDto)
        );
    };

    return (
        <form
            className="w-full h-max md:mt-8"
            onSubmit={handleSubmit(handleSubmitForm)}
        >
            <Input
                className="py-3 w-full"
                label="Email"
                placeholder="Please enter your Email"
                register={register("email")}
                error={errors.email}
            />
            <Input
                className="py-3 w-full"
                label="Password"
                placeholder="Please enter your Password"
                register={register("password")}
                type="password"
                error={errors.password}
            />
            <Link className="mt-2 block text-sm text-gray-500" to="/">
                Forgot password?
            </Link>
            <Button
                className="mt-2.5 block"
                type="submit"
                disabled={
                    userState.status === "loading" ||
                    userState.status === "init"
                }
            >
                Login
            </Button>
        </form>
    );
};

const schema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required!")
        .email("Please input a correct email format!"),
    password: yup
        .string()
        .required("Password is required!")
        .min(6, "Password must be minimum of 6 characters length"),
});

export default LoginForm;
