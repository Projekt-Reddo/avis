import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import "theme/Input.css";

interface InputProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    className?: string;
    style?: any;
    label?: string;
    register: InputRegister;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    isRequired?: boolean;
}

const Input: React.FC<InputProps> = ({
    children,
    className = "",
    style = {},
    isRequired = false,
    label,
    register,
    error,
    ...props
}) => {
    return (
        <div className={`${className}`} style={style}>
            {label && (
                <label htmlFor={register.name} className="block mb-1 font-bold">
                    {label}{" "}
                    {isRequired ? (
                        <span className="text-red-600">*</span>
                    ) : null}
                </label>
            )}
            <input
                className="input-app w-full"
                id={register.name}
                {...register}
                {...props}
            />
            {error?.message && (
                <span className="text-red-600">{`${error.message}`}</span>
            )}
        </div>
    );
};

export default Input;
