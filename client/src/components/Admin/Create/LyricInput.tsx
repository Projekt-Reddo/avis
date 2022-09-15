import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/shared/Button";
import Icon from "components/shared/Icon";
import { Dispatch, FunctionComponent, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import yup from "utils/yup-config";
import Editor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import React from "react";
import style from "theme/markdown-styles.module.css";

interface LyricInputProps {
    song: SongCreateDto;
    setSong: Dispatch<React.SetStateAction<SongCreateDto>>;
    currentStep?: number;
    nextFormStep: () => void;
    previousFormStep: () => void;
}

const LyricInput: FunctionComponent<LyricInputProps> = ({
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

    const onSubmit = (values: FieldValues) => {
        setSong({ ...song, ...values });
        nextFormStep();
    };

    // Markdown Editor config
    const mdEditor = React.useRef(null);
    const [mdContent, setMdContent] = React.useState<string>();
    const handleEditorChange = (md: any) => {
        const newValue = md.text.replace(/\d/g, "");
        setMdContent(newValue);
        setValue("lyric", newValue);
    };

    useEffect(() => {
        const lyric = getValues("lyric");
        if (lyric) {
            setMdContent(lyric);
        }
    }, []);

    return (
        <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div
                className="flex flex-col items-center justify-center"
                style={{
                    minHeight: "22rem",
                }}
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

                {errors.lyric?.message && (
                    <span className="text-red-600 mt-3">{`${errors.lyric?.message}`}</span>
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
                    >
                        <Icon icon="arrow-right" className="text-white" />
                        <span className="ml-2 text-white">Next</span>
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default LyricInput;

const schema = yup.object().shape({
    lyric: yup.string().required("Lyric is required!"),
});
