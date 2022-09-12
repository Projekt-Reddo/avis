import React from "react";
import PageWrapper from "components/shared/PageWrapper";
import StepFrom from "components/Admin/Create/StepForm";

const Create = () => {
    // document.title = "Create song";
    return (
        <PageWrapper className="bg-[#F0F0F5]">
            <StepFrom clasName="mx-5 lg:mx-0" />
        </PageWrapper>
    );
};

export default Create;
