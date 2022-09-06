import * as React from "react";
import { IonInput } from "@ionic/react";
import "./SignUpForm.css";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface InputProps {
    type?: TextFieldTypes;
    label?: string;
    placeholder?: string;
    className?: string;
    style?: {};
    register: InputRegister;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const Input: React.FunctionComponent<InputProps> = ({
    label,
    placeholder,
    className = "",
    style = {},
    type = "text",
    register,
    error,
}) => {
    return (
        <div className={`${className}`} style={style}>
            {label ? <label className="font-bold">{label}</label> : ""}
            <IonInput
                type={type}
                className="inputTextIon rounded-xl"
                placeholder={placeholder}
                id={register.name}
                {...register}
            ></IonInput>
            {error?.message && (
                <span className="text-red-600">{`${error.message}`}</span>
            )}
        </div>
    );
};

export default Input;
