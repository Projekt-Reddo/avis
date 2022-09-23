import { Link, LinkProps } from "react-router-dom";
import "theme/Button.css";
import { buttonVariants } from "./Button";

interface ButtonLinkProps extends LinkProps {
    children?: React.ReactNode;
    className?: string;
    style?: any;
    variant?: ButtonVariantNameType;
    border?: boolean | "true" | "false";
    to: any;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
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

export default ButtonLink;
