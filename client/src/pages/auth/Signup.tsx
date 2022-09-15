import React from "react";
import signup_image from "static/Flat_art_signup.jpg";
import SignUpForm from "components/SignUp/SignUpForm";
import "components/SignUp/SignUpForm.css";
import GoogleLoginButton from "components/SignUp/GoogleLoginButton";
import { IonButton } from "@ionic/react";
import PageWrapperAuth from "components/shared/PageWrapperAuth";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <PageWrapperAuth
      leftImage={signup_image}
      rightContent={
        <div className="h-screen background">
          <div className="w-full flex flex-col justify-center text-black px-10">
            <div className="flex flex-row justify-between py-2 md:py-10">
              <p className="font-bold text-2xl md:text-4xl">Welcome to Avis</p>
              <p className="text-xl md:text-3xl text-pink-500">
                <Link to="/feedback">Logo</Link>
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center md:mt-10 px-10">
            <SignUpForm />
            <div className="md:mt-10 w-full grid grid-cols-2 py-5">
              <div className="textGray col-span-1">
                <div className="flex flex-col items-start text-start">
                  <p className="w-full">Login with google</p>
                  <GoogleLoginButton />
                </div>
              </div>
              <div className="textGray col-span-1 flex flex-col items-end text-ends">
                <p className="text-xs md:text-base">Already have an account?</p>
                <IonButton className="loginButtonIon textGray">
                  <Link to="/login">Login</Link>
                </IonButton>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Signup;
