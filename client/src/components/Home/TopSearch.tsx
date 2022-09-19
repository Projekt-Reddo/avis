import * as React from "react";

import ImgBG from "../../static/121003.jpg"

interface TopSearchProp {}



const TopSearch : React.FC<TopSearchProp> = () =>
{
    const hummingSearch = (data: any) =>
    {

    }

    return (
        <div className="ml-[4rem] mt-10">
            <div className="text-2xl mb-10 text-black font-bold">
                Top Result
            </div>
            <div className="grid grid-rows-4 md:grid-rows-2 grid-flow-col gap-4 w-[90%] ">
                <div className="flex flex-row rounded-lg mb-6 shadow-xl max-w-[30rem] border-solid border-2">
                    <div className="basis-1/4 ">
                        <img className="rounded-md" src={ImgBG}/>
                    </div>
                    <div className="basis-1/2 ml-5">
                        <div className="text-xl font-bold">
                            Yoru ni Kakeru
                        </div>
                        <div>
                            Yoasobi
                        </div>
                        <div>
                            J-pop
                        </div>
                    </div>
                </div>
                <div className="flex flex-row rounded mb-6 shadow-xl max-w-[30rem] border-solid border-2">
                    <div className="basis-1/4">
                        <img className="rounded-md" src={ImgBG}/>
                    </div>
                    <div className="basis-1/2 ml-5">
                        <div className="text-xl font-bold">
                            Yoru ni Kakeru
                        </div>
                        <div>
                            Yoasobi
                        </div>
                        <div>
                            J-pop
                        </div>
                    </div>
                </div>
                <div className="flex flex-row rounded mb-6 shadow-xl max-w-[30rem] border-solid border-2">
                    <div className="basis-1/4">
                        <img className="rounded-md" src={ImgBG}/>
                    </div>
                    <div className="basis-1/2 ml-5">
                        <div className="text-xl font-bold">
                            Yoru ni Kakeru
                        </div>
                        <div>
                            Yoasobi
                        </div>
                        <div>
                            J-pop
                        </div>
                    </div>
                </div>
                <div className="flex flex-row rounded mb-6 shadow-xl max-w-[30rem] border-solid border-2">
                    <div className="basis-1/4">
                        <img className="rounded-md" src={ImgBG}/>
                    </div>
                    <div className="basis-1/2 ml-5">
                        <div className="text-xl font-bold">
                            Yoru ni Kakeru
                        </div>
                        <div>
                            Yoasobi
                        </div>
                        <div>
                            J-pop
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TopSearch;