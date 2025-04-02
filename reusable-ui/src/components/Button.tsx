import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button = ({ children, className, onClick, disabled, ...props }: ButtonProps) => {
    return (
        <button
            className={`
          px-4 py-1
          text-white 
          ${disabled ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-400
          rounded-md
          ${className || ''}
        `}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export { Button }