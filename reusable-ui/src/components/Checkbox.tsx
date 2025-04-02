import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    className?: string;
}

const Checkbox = ({ label, className, ...props }: CheckboxProps) => {
    return (
        <div className="flex items-center mb-4">
            <input
                type="checkbox"
                className={`
          h-5 w-5
          text-blue-500
          border-gray-300
          rounded
          focus:ring-blue-500
          ${className || ''}
        `}
                {...props}
            />
            {label && (
                <label htmlFor={props.id} className="ml-2 text-gray-700">
                    {label}
                </label>
            )}
        </div>
    );
};

export { Checkbox };
