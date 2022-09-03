import * as React from "react";
import { IonInput } from "@ionic/react";
import "./SignUpForm.css";
import { ChangeHandler } from "react-hook-form";

interface InputProps {
    type?: TextFieldTypes;
    label?: string;
    placeholder?: string;
    className?: string;
    style?: {};
    register: InputRegister;
}

const Input: React.FunctionComponent<InputProps> = ({
    label,
    placeholder,
    className = "",
    style = {},
    type = "text",
    register,
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
        </div>
    );
};

export default Input;
