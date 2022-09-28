import React, { useEffect } from "react";
import { useLocation } from "react-router";

import backgroundImage from "static/Flat_art_verify_email.webp";
import PageWrapperAuth from "components/PageWrapper/PageWrapperAuth";
import Button from "components/Button/Button";

const VerifyEmail = () => {
    const location: any = useLocation();

    useEffect(() => {
        // Prevent normal user from access the email verify page by typing in the url
        if (!location?.state?.user) {
            window.location.replace("/");
        }
    }, []);

    return (
        <PageWrapperAuth
            leftImage={backgroundImage}
            rightContent={
                <div className="h-full p-10 flex flex-col justify-center items-center">
                    <div>
                        <h3 className="font-bold text-2xl">
                            Verify your Email
                        </h3>
                        <div className="text-lg">
                            We sent a verify link to your email address, please
                            check it!
                        </div>
                        <div className="mt-4 ">
                            <Button
                                onClick={() => {
                                    window.location.replace("/");
                                }}
                            >
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </div>
            }
        />
    );
};

export default VerifyEmail;
