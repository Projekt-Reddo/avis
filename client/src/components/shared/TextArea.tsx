import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import "theme/TextArea.css";

interface TextAreaProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    > {
    className?: string;
    style?: any;
    rows?: number;
    label?: string;
    register: TextAreaRegister;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const TextArea: React.FC<TextAreaProps> = ({
    children,
    className = "",
    rows = 3,
    style = {},
    label,
    register,
    error,
    ...props
}) => {
    return (
        <div className={`${className}`} style={style}>
            {label && (
                <label htmlFor={register.name} className="block mb-1 font-bold">
                    {label}
                </label>
            )}
            <textarea
                className="textarea-app w-full"
                id={register.name}
                rows={rows}
                {...register}
                {...props}
            />
            {error?.message && (
                <span
                    className="text-[color:var(--red-general-color)]"
                    data-cy="error-message"
                >{`${error.message}`}</span>
            )}
        </div>
    );
};

export default TextArea;
