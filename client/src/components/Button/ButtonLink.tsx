import { Link } from "react-router-dom";
import "theme/Button.css";
import { buttonVariants } from "./Button";

interface ButtonProps extends Link {
    children?: React.ReactNode;
    className?: string;
    style?: any;
    variant?: ButtonVariantNameType;
    border?: boolean | "true" | "false";
    to: any;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = "",
    style = {},
    variant = "primary",
    border = false,
    to,
    ...props
}) => {
    return (
        <Link
            to={to}
            className={`btn-app ${className} ${
                `${border}` === "true" && "border"
            }`}
            style={{ ...buttonVariants[variant], ...style }}
            {...props}
        >
            {children}
        </Link>
    );
};

export default Button;
