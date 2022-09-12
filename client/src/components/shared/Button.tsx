import { ButtonHTMLAttributes } from "react";
import "theme/Button.css";

interface ButtonProps
    extends React.DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    children?: React.ReactNode;
    className?: string;
    style?: any;
    variant?: ButtonVariantNameType;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = "",
    style = {},
    variant = "primary",
    ...props
}) => {
    return (
        <button
            className={`btn-app ${className}`}
            style={{ ...buttonVariants[variant], ...style }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

const buttonVariants: ButtonVariantsType = {
    primary: {
        backgroundColor: "var(--teal-general-color)",
        color: "var(--white-color)",
    },
    secondary: {
        backgroundColor: "var(--white-color)",
        color: "var(--teal-general-color)",
    },
    danger: {
        backgroundColor: "var(--red-general-color)",
        color: "var(--white-color)",
    },
};
