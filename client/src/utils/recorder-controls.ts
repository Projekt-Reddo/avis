import { SetRecorder } from "types/recorder";

export async function startRecording(setRecorderState: SetRecorder) {
    try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        setRecorderState((prevState) => {
            return {
                ...prevState,
                initRecording: true,
                mediaStream: stream,
            };
        });
    } catch (err) {
        console.log(err);
    }
}

export function saveRecording(
    recorder: any,
    ExportMP3: (recorder: any) => void
) {
    // console.log(recorder)
    ExportMP3(recorder);
    if (recorder.state !== "inactive") recorder.stop();
}
