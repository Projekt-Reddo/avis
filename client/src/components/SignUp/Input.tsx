import * as React from "react";
import { IonInput } from "@ionic/react";
import "./SignUpForm.css";

interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: any;
  className?: string;
  style?: {};
}

const Input: React.FunctionComponent<InputProps> = ({
  label,
  placeholder,
  id,
  value,
  name,
  className,
  style = {},
  onChange,
  type = "text",
}) => {
  return (
    <div className={className}>
      {label ? <label className="font-bold">{label}</label> : ""}
      <IonInput
        name={name}
        className="inputTextIon rounded-xl"
        onIonInput={(e) => onChange(e)}
        placeholder={placeholder}
      ></IonInput>
    </div>
  );
};

export default Input;
