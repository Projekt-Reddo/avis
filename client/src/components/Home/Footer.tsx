import Icon from "components/shared/Icon";
import * as React from "react";
import { MOBILE_BREAKPOINT } from "utils/constants";
import { useWindowDimensions } from "utils/useWindowDimensions";

interface FooterProp {}

const Footer: React.FC<FooterProp> = () => {
    const { width } = useWindowDimensions();

    if (width && width <= MOBILE_BREAKPOINT) {
        return <></>;
    }

    return (
        <div className="h-[0rem] border-t-2 md:h-[7rem]">
            <div className="grid grid-rows-1  grid-flow-col gap-4 mt-4  ml-[10rem] ">
                <div>
                    <div className="font-bold">@2022 - Reddo Team</div>
                    <br />
                    <div className="text-sm">PRIVACY POLICY</div>
                </div>
                <div>
                    <div className="font-bold">CONTACT</div>
                    <br />
                    <div className="text-sm">ABOUT US</div>
                </div>
                <div>
                    <div className="font-bold">FOLLOW</div>
                    <br></br>
                    <div>
                        <Icon icon={["fab", "twitter"]} className="w-5" />{" "}
                        <Icon icon={["fab", "facebook"]} className="w-5 ml-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
