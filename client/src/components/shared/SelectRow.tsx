import { Dispatch, FunctionComponent } from "react";
import Select from "react-select";

interface SelectRowProps {
    className?: string;
    state: {
        label: string;
        value: number;
    };
    setState: any;
}

const showRowOptions = [
    { value: 10, label: "10 rows" },
    { value: 25, label: "25 rows" },
    { value: 50, label: "50 rows" },
];

const SelectRow: FunctionComponent<SelectRowProps> = ({
    className,
    state,
    setState,
}) => {
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            border: "0.5px solid rgba(0, 0, 0, 0.25)",
            boxShadow: "none",
            "&:hover": {
                border: "0.5px solid rgba(0, 0, 0, 0.35)",
            },
            backgroundColor: "var(--element-bg-color)",
            color: "var(--text-secondary-color)",
        }),
        menu: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: "var(--element-bg-color)",
            padding: "",
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: "var(--element-bg-color)",
            "&:hover": {
                backgroundColor: "var(--element-bg-color-elevate-1)",
            },
        }),
        singleValue: (styles: any) => ({
            ...styles,
            color: "var(--text-secondary-color)",
        }),
    };

    return (
        <Select
            className={`${className} w-32`}
            options={showRowOptions}
            styles={customStyles}
            defaultValue={state}
            onChange={(val: any) => {
                setState((state: any) => {
                    return {
                        ...state,
                        rowShow: val,
                    };
                });
            }}
        />
    );
};

export default SelectRow;
