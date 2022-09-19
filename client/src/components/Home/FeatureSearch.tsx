import * as React from "react";

interface FeatureSearchProp {};

const FeatureSearch : React.FC<FeatureSearchProp> = () =>
{
    return(
        <div className="ml-[4rem] mt-10 max-w-[90%]">
            <div className="text-2xl mb-2 text-black font-bold">
                Features
            </div>
            <div className="text-xs mb-10 max-w-[30%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                <div className="rounded shadow-xl h-[20rem] max-w-[15rem] border-solid border-2">
                    <div className="w-12 h-12 rounded-full bg-rose-200 mt-7 mb-7 ml-3"></div>
                    <div className="font-bold ml-3 mb-2">
                        Feature 1
                    </div>
                    <div className="text-xs ml-3 mr-8 mb-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    </div>
                </div>
                <div className="rounded shadow-xl max-w-[15rem] border-solid border-2">
                    <div className="w-12 h-12 rounded-full bg-indigo-300 mt-7 mb-7 ml-3"></div>
                    <div className="font-bold ml-3 mb-2">
                        Feature 2
                    </div>
                    <div className="text-xs ml-3 mr-8 mb-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    </div>
                </div>
                <div className="rounded shadow-xl max-w-[15rem] border-solid border-2">
                    <div className="w-12 h-12 rounded-full bg-sky-300 mt-7 mb-7 ml-3"></div>
                    <div className="font-bold ml-3 mb-2">
                        Feature 3
                    </div>
                    <div className="text-xs ml-3 mr-8 mb-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    </div>
                </div>
                <div className="rounded shadow-xl max-w-[15rem] border-solid border-2">
                    <div className="w-12 h-12 rounded-full bg-sky-100 mt-7 mb-7 ml-3"></div>
                    <div className="font-bold ml-3 mb-2">
                        Feature 4
                    </div>
                    <div className="text-xs ml-3 mr-8 mb-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeatureSearch;