import { Dispatch, FunctionComponent } from "react";
import Select from "react-select";

interface SelectRowProps {
    className?: string;
    style?: any;
    state: {
        label: string;
        value: number;
    };
    setState: Dispatch<
        React.SetStateAction<{
            label: string;
            value: number;
        }>
    >;
}

const showRowOptions = [
    { value: 10, label: "10 rows" },
    { value: 25, label: "25 rows" },
    { value: 50, label: "50 rows" },
];

const SelectRow: FunctionComponent<SelectRowProps> = ({
    className,
    style,
    state,
    setState,
}) => {
    return (
        <Select
            className={`${className} hidden sm:block w-32`}
            styles={style}
            options={showRowOptions}
            defaultValue={state}
            onChange={(val: any) => {
                setState(val);
            }}
        />
    );
};

export default SelectRow;