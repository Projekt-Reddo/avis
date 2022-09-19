import * as React from "react";
import useRecorder from "../../utils/hooks/use-recorder";
import { UseRecorder } from "types/recorder";
import Icon from "../shared/Icon";
import "../../theme/ThemeSearch.css"
import RecorderControls from "./Recording";
import { useAppDispatch } from "utils/react-redux-hooks";
import { searchSongAsync } from "store/slices/songSlice";


interface ThemeSearchProp {setSearch: React.Dispatch<React.SetStateAction<string>>}

const ThemeSearch : React.FC<ThemeSearchProp> = ({setSearch}) =>
{
    const [isRecording,setRecording] = React.useState(false);

    const dispatch = useAppDispatch();

    const { recorderState, ...handlers }: UseRecorder = useRecorder();

    const [searchValue,setSearchValue] = React.useState("");

    const Recording = () => {
        setRecording(true);
    }

    const SearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setSearchValue(e.target.value);
    }

    const Searching = (e: React.FormEvent) =>
    {
        e.preventDefault();
        setSearch(searchValue);
    }

    const ExportMP3 = (recorder: any) =>
    {
        console.log(recorder.stream);
        dispatch(
            searchSongAsync({
                hum: recorder.stream
            })
        );
    }

    return (
        <div>
            {isRecording ? (
            <div>
                    <div className="Micro-Icon h-[15rem] w-[15rem] mt-[7rem] bg-white flex justify-center items-center border rounded-full">
                        <RecorderControls recorderState={recorderState} handlers={handlers} ExportMP3={ExportMP3} setRecording={setRecording} />
                    </div>
                    <br></br>
                    <div className="Listening text-2xl">
                        <div>
                            Listening
                        </div>
                    </div>
                <div>
                    <div className="Theme-Search2 h-[35rem] mt-10 flex justify-center items-center">
                    <div className="">
                            <div className=" grid justify-items-center ">
                                <div className="text-4xl mb-10 text-black font-bold text-center ">
                                    Discover and search song
                                </div>
                                <div className="mb-3 w-[15rem] md:w-[35rem]">
                                    <div className="flex flex-wrap  w-full mb-4 h-15 bg-white items-center rounded mb-6  shadow-xl">
                                        <div className="flex -mr-px justify-center p-3">
                                            <span
                                                className="flex items-center leading-normal bg-white  border-0 rounded rounded-r-none text-2xl text-gray-600"
                                            >
                                                <Icon icon="search" className="w-5 h-5 text-[#4964B8] "/>
                                            </span>
                                        </div>
                                            <form>
                                                <input type="search" className="w-[9rem] md:w-[29rem] text-base font-normal text-gray-700 bg-white transition ease-in-out focus:text-gray-700  focus:outline-none " placeholder="Search your Song" disabled />
                                            </form>
                                            <span
                                                className="flex  leading-normal bg-white  border-0 rounded rounded-r-none text-2xl text-gray-600"
                                            >
                                                <Icon icon="microphone" className="w-5 h-5 text-[#14B8A6]" onClick={Recording}/>
                                            </span>
                                    </div>
                                </div>
                                <div className="text-black">
                                    Search for songs using hum, name or lyrics
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ) : (
                <div>
                    <div className="Theme-Search h-[35rem] mt-10 flex justify-center items-center">
                        <div className="">
                            <div className=" grid justify-items-center ">
                                <div className="text-4xl mb-10 text-black font-bold text-center ">
                                    Discover and search song
                                </div>
                                <div className="mb-3 w-[15rem] md:w-[35rem]">
                                    <div className="flex flex-wrap  w-full mb-4 h-15 bg-white items-center rounded mb-6  shadow-xl">
                                        <div className="flex -mr-px justify-center p-3">
                                            <span
                                                className="flex items-center leading-normal bg-white  border-0 rounded rounded-r-none text-2xl text-gray-600"
                                            >
                                                <Icon icon="search" className="w-5 h-5 text-[#4964B8] "/>
                                            </span>
                                        </div>
                                        <form onSubmit={Searching}>
                                            <input type="search"
                                                className="w-[9rem] md:w-[29rem] text-base font-normal text-gray-700 bg-white transition ease-in-out focus:text-gray-700  focus:outline-none "
                                                placeholder="Search your Song"
                                                onChange={SearchChange}
                                            />
                                        </form>
                                        <span
                                            className="flex  leading-normal bg-white  border-0 rounded rounded-r-none text-2xl text-gray-600"
                                        >
                                            <Icon icon="microphone" className="w-5 h-5 text-[#14B8A6]" onClick={Recording}/>
                                        </span>
                                    </div>
                                </div>
                                <div className="text-black">
                                    Search for songs using hum, name or lyrics
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThemeSearch;


