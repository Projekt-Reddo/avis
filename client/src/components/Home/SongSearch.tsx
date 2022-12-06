import * as React from "react";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { textSearchAsync, humToSongAsync } from "store/slices/searchSlice";
import Icon from "components/shared/Icon";
import "theme/Home.css";
import { addNewToast } from "components/Toast";
import { saveSearchHistory } from "./search-history-hook";
import History from "./History";
import { TIME_TO_HUM } from "utils/constants";
import LIGHT_BG from "static/Home-bg.webp";
import DARK_BG from "static/Home-bg-dark.jpg";
import { VoiceRecorder } from "capacitor-voice-recorder";
import { base64StringToBlob } from "blob-util";

interface SongSearchProp {
    scrollRef: React.RefObject<HTMLDivElement>;
}

interface RecordInfo {
    isRecording: boolean;
    blobURL: string;
    blob: Blob | null;
}

const SongSearch: React.FC<SongSearchProp> = ({ scrollRef }) => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme);

    //#region Hum search

    const [record, setRecord] = React.useState<RecordInfo>({
        isRecording: false,
        blobURL: "",
        blob: null,
    });

    const startRecord = async () => {
        VoiceRecorder.requestAudioRecordingPermission().then((status) => {
            if (Object.hasOwn(status, "voice recording")) {
                // @ts-ignore
                if (status["voice recording"] !== "granted") {
                    addNewToast({
                        variant: "danger",
                        message: "Please enable microphone for recording",
                    });
                    return;
                }
            } else {
                if (status.value !== true) {
                    addNewToast({
                        variant: "danger",
                        message: "Please enable microphone for recording",
                    });
                    return;
                }
            }

            // Record
            VoiceRecorder.startRecording()
                .then(() => {
                    setRecord((prev) => ({ ...prev, isRecording: true }));
                })
                .catch((e) => console.log(e));
        });
    };

    React.useEffect(() => {
        if (record.isRecording) {
            endRecord();
        }
    }, [record]);

    const endRecord = async () => {
        await delay(12.5 * 1000);

        VoiceRecorder.stopRecording()
            .then((result) => {
                const blob = base64StringToBlob(
                    result.value.recordDataBase64,
                    "audio/mpeg"
                );
                dispatch(humToSongAsync(blob));
                handleScrollToResult();
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setRecord((prev) => ({
                    ...prev,
                    isRecording: false,
                }));
            });
    };

    // Listening animation
    const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

    const handleScrollToResult = () => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    //#endregion

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
                        record.isRecording
                            ? "searching animate absolute h-[91vh] w-screen flex justify-center items-center bg-opacity-80 z-10"
                            : "searching animate-d absolute h-[91vh] w-screen flex justify-center items-center bg-opacity-80 z-10"
                    }
                >
                    <div className="text-4xl h-56 w-56 mb-10 rounded-full border-2 border-[color:var(--border-color)] bg-[color:var(--element-bg-color)] flex flex-col justify-center items-center color">
                        <div className="wave text-4xl h-48 w-48 rounded-full border border-[color:var(--border-color)] bg-[color:var(--element-bg-color)] flex flex-col justify-center items-center color">
                            <Icon
                                icon="microphone"
                                className="text-[color:var(--teal-general-color)]"
                            ></Icon>
                        </div>
                    </div>
                    <div className="listen text-xl text-[color:var(--text-primary-color)] font-bold absolute">
                        Try to hum something in {TIME_TO_HUM} secs
                    </div>
                    <div className="listen text-3xl text-[color:var(--text-primary-color)] font-bold absolute mt-10">
                        Listening
                    </div>
                </div>
            )}
            <div
                className="h-[94vh] flex justify-center items-center"
                style={{
                    backgroundImage: `url(${
                        theme.status === "idle" && theme.data.value === "dark"
                            ? DARK_BG
                            : LIGHT_BG
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className=" grid justify-items-center">
                    <div
                        className="text-4xl mb-10 font-bold text-center"
                        data-cy="text-search-header"
                    >
                        Discover and search song
                    </div>
                    <div className="relative w-80 md:w-[35rem] flex h-15 bg-[color:var(--element-bg-color)] items-center rounded-xl border-[0.25px] border-[color:var(--border-color)] mb-6 shadow-md">
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
                                <span className="leading-normal bg-[color:var(--element-bg-color)] text-2xl text-gray-600">
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
                                className="md:w-[29rem] ml-3 text-base font-normal text-gray-700 bg-[color:var(--element-bg-color)] transition ease-in-out focus:text-gray-700 focus:outline-none md: w-[14.5rem]"
                                placeholder="Search for song"
                                onChange={handleChange}
                                value={searchValue}
                                onFocus={() => {
                                    setShowHistory(true);
                                }}
                                ref={inputRef}
                                data-cy="input-text-search"
                            />
                        </form>
                        <div className="h-full flex items-center justify-center pr-3">
                            <button
                                onClick={startRecord}
                                disabled={record.isRecording}
                                className="flex leading-normal bg-[color:var(--element-bg-color)] border-0 rounded rounded-r-none text-2xl text-gray-600"
                            >
                                <Icon
                                    icon="microphone"
                                    className="w-5 text-[color:var(--teal-general-color)]"
                                    size="sm"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="">
                        Search for songs using hum, name or lyrics
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongSearch;
