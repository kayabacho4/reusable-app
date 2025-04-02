import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type CommonTextFieldProps = {
    label?: string;
    className?: string;
    multiline?: boolean;
    rows?: number;
}

type TextFieldInputProps = CommonTextFieldProps & 
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof CommonTextFieldProps | 'type'> & {
    multiline?: false;
    type?: React.HTMLInputTypeAttribute;
}

type TextFieldTextareaProps = CommonTextFieldProps & 
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof CommonTextFieldProps> & {
    multiline: true;
}

type TextFieldProps = TextFieldInputProps | TextFieldTextareaProps;

const TextField: React.FC<TextFieldProps> = ({ 
    label, 
    className, 
    multiline = false, 
    rows = 3,
    ...props 
}) => {
    const baseClassName = `
        border
        rounded-md
        px-3 py-2
        w-full
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-400
        ${className || ''}
    `;

    return (
        <div>
            {label && (
                <label htmlFor={props.id} className="block mb-1">
                    {label}
                </label>
            )}
            {multiline ? (
                <textarea
                    rows={rows}
                    className={baseClassName}
                    {...props as TextareaHTMLAttributes<HTMLTextAreaElement>}
                />
            ) : (
                <input
                    className={baseClassName}
                    {...props as InputHTMLAttributes<HTMLInputElement>}
                />
            )}
        </div>
    );
};

export { TextField };