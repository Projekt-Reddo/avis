import { FunctionComponent, useState } from "react";
import {
    Control,
    Controller,
    FieldError,
    FieldErrorsImpl,
    Merge,
} from "react-hook-form";
import AsyncSelect from "react-select/async";

interface SelectAsyncProps {
    className?: string;
    style?: any;
    isMulti: boolean;
    loadOptionsCallback: (keyword: string) => Promise<any>;
    control: any;
    controlName: any;
    optionConfig: {
        label: string; // response property for displaying lable
        value: string; // response property for storing value
    };
    error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
}

const SelectAsync: FunctionComponent<SelectAsyncProps> = ({
    className,
    isMulti,
    loadOptionsCallback,
    control,
    controlName,
    optionConfig,
    error,
}) => {
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            border: "0.5px solid rgba(0, 0, 0, 0.25)",
            boxShadow: "none",
            "&:hover": {
                border: "0.5px solid rgba(0, 0, 0, 0.35)",
            },
        }),
    };

    const [options, setOptions] = useState([]);

    const handleInputChange = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, "");
        return inputValue;
    };

    const mapOptionsToValues = (options: any) => {
        const generatedOptions = options.map((option: any) => ({
            value: option[optionConfig.value],
            label: option[optionConfig.label],
        }));

        setOptions(generatedOptions);
        return generatedOptions;
    };

    const loadOptions = (
        inputValue: string,
        callback: (options: any) => void
    ) => {
        var rs = loadOptionsCallback(inputValue);
        rs.then((res) => {
            callback(mapOptionsToValues(res));
        });
    };

    return (
        <>
            <Controller
                control={control}
                name={controlName}
                render={({ field: { onChange, value, ref } }) => (
                    <AsyncSelect
                        ref={ref}
                        className={`${className}`}
                        styles={customStyles}
                        isMulti={isMulti}
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 8,
                        })}
                        cacheOptions
                        loadOptions={loadOptions}
                        defaultOptions
                        onInputChange={handleInputChange}
                        value={options.filter(
                            (c: any) => value && value!.includes(c.value)
                        )}
                        onChange={(val: any) =>
                            isMulti
                                ? onChange(val.map((c: any) => c.value))
                                : onChange(val.value)
                        }
                    />
                )}
            />

            {error?.message && (
                <span className="text-[color:var(--red-general-color)]">{`${error.message}`}</span>
            )}
        </>
    );
};

export default SelectAsync;
