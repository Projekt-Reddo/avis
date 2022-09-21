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
    return (
        <Select
            className={`${className} w-32`}
            options={showRowOptions}
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
