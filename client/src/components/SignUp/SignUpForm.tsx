import { IonButton } from "@ionic/react";
import * as React from "react";

import Input from "../SignUp/Input";

interface SignUpFormProps {}
const SignUpForm: React.FunctionComponent<SignUpFormProps> = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange: any = (e: React.ChangeEvent<HTMLInputElement>) => {
    // No longer need to cast to any - hooray for react!
    // let target = e.currentTarget as HTMLInputElement;
    // let field = target.name;
    // let val = target.value;
    let field = e.target.name;
    let val = e.target.value;
    setFormData({ ...formData, [field]: val });
  };

  return (
    <div className="flex flex-col justify-center text-black">
      <div className="flex flex-row justify-between py-10">
        <p className="font-bold text-4xl">Welcome to Hum2Song</p>
        <p className="text-3xl text-pink-500">Logo</p>
      </div>
      <div className="w-full h-max mt-8">
        <Input
          className="py-2"
          label="Name"
          name="name"
          placeholder="Please enter your name"
          onChange={(e: any) => handleChange(e)}
        ></Input>
        <Input
          className="py-2"
          label="Email"
          name="email"
          placeholder="Please enter your Email"
          onChange={(e: any) => handleChange(e)}
        ></Input>
        <Input
          className="py-2"
          label="Password"
          name="password"
          placeholder="Please enter your Password"
          onChange={(e: any) => handleChange(e)}
        ></Input>
        <IonButton
          className="signUpButtonIon mt-5"
          onClick={() => {
            // console.log(formData);
          }}
        >
          Sign Up
        </IonButton>
      </div>
    </div>
  );
};

export default SignUpForm;
