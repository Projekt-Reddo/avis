import * as React from "react";
import { useAppDispatch } from "utils/react-redux-hooks";
import MicRecorder from "mic-recorder-to-mp3";
import { humToSongAsync } from "store/slices/songSlice";
import Icon from "components/shared/Icon";
import { addToast } from "store/slices/toastSlice";
import "../../theme/Home.css"

interface SongSearchProp {}

interface RecordInfo {
    isRecording: boolean;
    blobURL: string;
    isBlocked: boolean;
    blob: Blob | null;
}

const mp3Recorder = new MicRecorder({ bitRate: 128 });

const SongSearch: React.FC<SongSearchProp> = ({}) => {
    const [record, setRecord] = React.useState<RecordInfo>({
        isRecording: false,
        isBlocked: false,
        blobURL: "",
        blob: null,
    });

    const dispatch = useAppDispatch();

    // Checking user mic permission
    React.useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then()
            .catch((err: any) => {
                console.log(err);
                setRecord({ ...record, isBlocked: true });
            });
    }, []);

    const startRecord = () => {
        if (record.isBlocked) {
            dispatch(
                addToast({
                    variant: "danger",
                    message: "Please enable microphone for recording",
                })
            );
            return;
        }
        mp3Recorder
            .start()
            .then(() => {
                setRecord({ ...record, isRecording: true });
            })
            .catch((e: any) => console.log(e));
        setAppear(true);
    };

    const endRecord = async () => {
        setAppear(false);
        await delay(750);
        if (record.isBlocked) {
            return;
        }
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
            })
            .catch((e: any) => console.log(e));
    };


    const [searchValue, setSearchValue] = React.useState("");

    const [appear, setAppear] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTextSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const delay = (ms : any ) => new Promise(res => setTimeout(res, ms));

    return (
        <div>
            {record.isRecording && (
                <div className={
                    appear ?
                    "animate absolute h-[91vh] w-screen bg-white flex justify-center items-center bg-opacity-80 z-10 "
                    :
                    "animate-d absolute h-[91vh] w-screen bg-white flex justify-center items-center bg-opacity-80 z-10 "
                    }>
                    <div
                        className="text-2xl h-56 w-56 rounded-full border-2 flex flex-col justify-center items-center cursor-pointer"
                        onClick={endRecord}
                    >
                        <div className="font-medium">Listening</div>
                        <div className="text-sm">Click to stop listening</div>
                    </div>
                </div>
            )}
            <div className="search-bg h-[91vh] flex justify-center items-center">
                <div className=" grid justify-items-center ">
                    <div className="text-4xl mb-10 text-black font-bold text-center ">
                        Discover and search song
                    </div>
                    <div className="w-80 md:w-[35rem] flex h-15 bg-white items-center rounded-xl border-[0.25px] mb-6 shadow-md">
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
                                className="w-[9rem] md:w-[29rem] ml-3 text-base font-normal text-gray-700 bg-white transition ease-in-out focus:text-gray-700 focus:outline-none md: w-[14.5rem]"
                                placeholder="Search for song"
                                onChange={handleChange}
                                value={searchValue}
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
            {/* <audio src={record.blobURL} controls={true} /> */}
        </div>
    );
};

export default SongSearch;