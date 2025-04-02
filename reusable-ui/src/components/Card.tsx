import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card = ({ children, className, onClick, ...props }: CardProps) => {
    return (
        <div
            className={`
        bg-white
        rounded-lg
        shadow-md
        p-4
        ${className || ''}
      `}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

export { Card };
