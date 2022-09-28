import * as React from "react";
import { useAppDispatch } from "utils/react-redux-hooks";
import MicRecorder from "mic-recorder-to-mp3";
import { textSearchAsync, humToSongAsync } from "store/slices/searchSlice";
import Icon from "components/shared/Icon";
import "theme/Home.css";
import { addNewToast } from "components/Toast";
import { saveSearchHistory } from "./search-history-hook";
import History from "./History";

interface SongSearchProp {
    scrollRef: React.RefObject<HTMLDivElement>;
}

interface RecordInfo {
    isRecording: boolean;
    blobURL: string;
    blob: Blob | null;
}

const mp3Recorder = new MicRecorder({ bitRate: 128 });

const SongSearch: React.FC<SongSearchProp> = ({ scrollRef }) => {
    const dispatch = useAppDispatch();

    //#region Hum search

    const [record, setRecord] = React.useState<RecordInfo>({
        isRecording: false,
        blobURL: "",
        blob: null,
    });

    const [hum, setHum] = React.useState(false);

    const startRecord = async () => {
        // Check for mic permission
        setHum(true);
        const allowStatus = await navigator.permissions.query({
            // @ts-ignore
            name: "microphone",
        });
        if (allowStatus.state !== "granted") {
            try {
                await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            } catch (err: any) {
                addNewToast({
                    variant: "danger",
                    message: "Please enable microphone for recording",
                });
                console.log(err);
                return;
            }
        }

        mp3Recorder
            .start()
            .then(() => {
                setRecord({ ...record, isRecording: true });
            })
            .catch((e: any) => console.log(e));
        setAppear(true);
    };

    React.useEffect(() =>
    {
        if (hum) {
            StopHum();
        }
    }, [hum]);

    const StopHum = async () => {
        await delay(12000);
        endRecord();
        setHum(false);
    }

    const endRecord = async () => {
        setAppear(false);
        await delay(750);
        mp3Recorder
            .stop()
            .getMp3()
            .then((obj: any) => {
                // obj is [buffer, blob]
                var blob = obj[1]; // obj[1] get the blob
                const blobUrl = window.URL.createObjectURL(blob);
                setRecord({
                    ...record,
                    blobURL: blobUrl,
                    isRecording: false,
                });
                dispatch(humToSongAsync(blob)); // fetch api
                handleScrollToResult();
            })
            .catch((e: any) => console.log(e));
    };

    //#endregion

    // Listening animation
    const [appear, setAppear] = React.useState(false);
    const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

    const handleScrollToResult = () => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    //#region Text search

    const [searchValue, setSearchValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTextSearch = async (e: React.FormEvent) => {
        const value = searchValue.trim().replace(/\s+/g, " ");

        e.preventDefault();
        inputRef.current?.blur(); // remove focus on input

        if (!value) {
            return;
        }

        dispatch(textSearchAsync(value));
        await saveSearchHistory(value);
        setSearchValue("");
        handleScrollToResult();
    };

    const handleHistorySearch = (searchInput: string) => {
        const value = searchInput.trim().replace(/\s+/g, " ");
        dispatch(textSearchAsync(value));
        handleScrollToResult();
        setShowHistory(false);
    };

    const [showHistory, setShowHistory] = React.useState<boolean>(false);

    //#endregion

    return (
        <div>
            {record.isRecording && (
                <div
                    className={
                        appear
                            ? "animate absolute h-[91vh] w-screen bg-white flex justify-center items-center bg-opacity-80 z-10"
                            : "animate-d absolute h-[91vh] w-screen bg-white flex justify-center items-center bg-opacity-80 z-10"
                    }
                >
                    <div className="text-4xl h-56 w-56 mb-20 rounded-full border-2 bg-white flex flex-col justify-center items-center color" >
                        <div className="wave text-4xl h-48 w-48 rounded-full border bg-white flex flex-col justify-center items-center color" >
                            <Icon icon="microphone" className="text-[color:var(--teal-general-color)]"></Icon>
                        </div>
                    </div>
                    <div className="listen text-xl font-bold absolute">Try to Hum something in 10 secs</div>
                    <div className="listen text-3xl font-bold absolute mt-10">Listening</div>
                </div>
            )}
            <div className="search-bg h-[91vh] flex justify-center items-center">
                <div className=" grid justify-items-center ">
                    <div className="text-4xl mb-10 text-black font-bold text-center ">
                        Discover and search song
                    </div>
                    <div className="relative w-80 md:w-[35rem] flex h-15 bg-white items-center rounded-xl border-[0.25px] mb-6 shadow-md">
                        {showHistory && (
                            <History
                                onClickElement={handleHistorySearch}
                                setShowHistory={setShowHistory}
                                inputRef={inputRef}
                            />
                        )}
                        <form
                            className="flex flex-row py-1 pl-3"
                            onSubmit={handleTextSearch}
                        >
                            <div>
                                <span className="leading-normal bg-white text-2xl text-gray-600">
                                    <button type="submit">
                                        <Icon
                                            icon="search"
                                            className="w-5 text-[color:var(--blue-darker-color)]"
                                            size="sm"
                                        />
                                    </button>
                                </span>
                            </div>

                            <input
                                type="search"
                                className="md:w-[29rem] ml-3 text-base font-normal text-gray-700 bg-white transition ease-in-out focus:text-gray-700 focus:outline-none md: w-[14.5rem]"
                                placeholder="Search for song"
                                onChange={handleChange}
                                value={searchValue}
                                onFocus={() => {
                                    setShowHistory(true);
                                }}
                                ref={inputRef}
                            />
                        </form>
                        <div className="h-full flex items-center justify-center pr-3">
                            <button
                                onClick={startRecord}
                                disabled={record.isRecording}
                                className="flex leading-normal bg-white  border-0 rounded rounded-r-none text-2xl text-gray-600"
                            >
                                <Icon
                                    icon="microphone"
                                    className="w-5 text-[color:var(--teal-general-color)]"
                                    size="sm"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="text-black">
                        Search for songs using hum, name or lyrics
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongSearch;
