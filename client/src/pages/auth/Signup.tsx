import React from "react";
import signup_image from "static/dog_and_dog.jpg";
import SignUpForm from "components/SignUp/SignUpForm";
import "components/SignUp/SignUpForm.css";
import GoogleLoginButton from "components/SignUp/GoogleLoginButton";
import { IonButton } from "@ionic/react";
import PageWrapperAuth from "components/shared/PageWrapperAuth";

const Signup = () => {
    return (
        <PageWrapperAuth
            leftImage={signup_image}
            rightContent={
                <div className="h-screen px-10 backgroundSignUp">
                    <SignUpForm />
                    <hr className="mt-4 mb-10 border"></hr>
                    <div className=" grid grid-cols-2">
                        <div className="textGray col-span-1">
                            <div className="flex flex-col items-start text-start">
                                <p className="w-full">Login with google</p>
                                <GoogleLoginButton />
                            </div>
                        </div>
                        <div className="textGray col-span-1 flex flex-col items-end text-ends">
                            <p>Already have an account?</p>
                            <IonButton className="loginButtonIon textGray">
                                Login
                            </IonButton>
                        </div>
                    </div>
                </div>
            }
        />
    );
};

export default Signup;
