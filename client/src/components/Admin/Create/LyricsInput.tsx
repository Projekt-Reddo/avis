import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button/Button";
import Icon from "components/shared/Icon";
import { Dispatch, FunctionComponent, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import yup from "utils/yup-config";
import Editor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import React from "react";
import style from "components/Admin/Create/markdown-styles.module.css";
import { useAppSelector } from "utils/react-redux-hooks";

interface LyricsInputProps {
    song: SongCreate;
    setSong: Dispatch<React.SetStateAction<SongCreate>>;
    currentStep?: number;
    nextFormStep: () => void;
    previousFormStep: () => void;
}

const LyricsInput: FunctionComponent<LyricsInputProps> = ({
    song,
    setSong,
    currentStep,
    nextFormStep,
    previousFormStep,
}) => {
    const {
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: song,
    });

    const songState = useAppSelector((state) => state.song); // Check isSubmitting or not

    const onSubmit = (values: FieldValues) => {
        nextFormStep();
    };

    // Markdown Editor config
    const mdEditor = React.useRef(null);
    const [mdContent, setMdContent] = React.useState<string>();
    const handleEditorChange = (md: any) => {
        const newValue = md.text.replace(/\d/g, "");
        setMdContent(newValue);
        setValue("lyrics", newValue);
        setSong({ ...song, lyrics: newValue });
    };

    useEffect(() => {
        const lyrics = getValues("lyrics");
        if (lyrics) {
            setMdContent(lyrics);
        }
    }, []);

    return (
        <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div
                className="flex flex-col items-center justify-center"
                style={{
                    minHeight: "22rem",
                }}
                data-cy="create-song-lyric"
            >
                <div className="w-full flex justify-between mb-3">
                    <div className="font-semibold">Input</div>
                    <div className="font-semibold">Display</div>
                </div>
                <Editor
                    ref={mdEditor}
                    value={mdContent}
                    style={{
                        height: "auto",
                        minHeight: "22rem",
                        width: "100%",
                    }}
                    onChange={handleEditorChange}
                    renderHTML={(text) => (
                        <ReactMarkdown
                            children={text}
                            className={style.reactMarkDown}
                        />
                    )}
                    view={{
                        menu: false, // hide options
                        md: true,
                        html: true,
                    }}
                    className="rounded-md"
                />

                {errors.lyrics?.message && (
                    <span className="text-[color:var(--red-general-color)] mt-3">{`${errors.lyrics?.message}`}</span>
                )}
            </div>

            {/* Form navigate btn */}
            <div className="col-span-6">
                <div className="flex flex-row justify-end mt-4">
                    <Button
                        type="submit"
                        className="mr-5 border-2 border-blue-500"
                        style={{
                            boxShadow: "none !important",
                        }}
                        variant="secondary"
                        onClick={() => {
                            previousFormStep();
                            setSong({ ...song, ...getValues() });
                        }}
                    >
                        <Icon icon="arrow-left" />
                        <span className="ml-2">Back</span>
                    </Button>
                    <Button
                        type="submit"
                        style={{
                            boxShadow: "none !important",
                        }}
                        disabled={songState.status === "loading"}
                    >
                        <Icon icon="plus" className="text-white" />
                        <span className="ml-2 text-white" data-cy="submit-btn">
                            Submit
                        </span>
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default LyricsInput;

const schema = yup.object().shape({
    lyrics: yup.string().nullable(),
});
