import { useEffect } from "react";
import { RecorderControlsProps } from "types/recorder";
import Icon from "../shared/Icon";

export default function RecorderControls({  handlers, ExportMP3, setRecording }: RecorderControlsProps) {

    const { startRecording, saveRecording, cancelRecording } = handlers;

    useEffect(() => {
      startRecording()
    },[]);

    return (
      <div>
        {/* <button className="start-button"
         title="Start recording"
        onClick={startRecording}>
            <Icon icon="microphone" className="w-5 h-5 text-[#4964B8]"/>
        </button> */}
        <button
            className="start-button"
            title="Save recording"
            onClick={(recorder) =>{
              saveRecording (ExportMP3)
              setRecording(false);
            }}
          >
            <Icon icon="floppy-disk" className="ml-5 w-5 h-5 text-[#4964B8]" />
          </button>

      </div>
    );
  }