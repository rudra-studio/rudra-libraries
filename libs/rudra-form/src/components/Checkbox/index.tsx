import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string; /* @translate */
  helperText?: string; /* @translate */
  errorText?: string; /* @translate */
  customColor?: string; /* @color */
}

export default function Checkbox({
  label,
  helperText,
  errorText,
  customColor = '#3b82f6', // Default blue-500
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || React.useId();
  const hasError = !!errorText;

  return (
    <div className={`flex items-start gap-3 w-full ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          aria-invalid={hasError}
          className={`
            w-4 h-4 mt-0.5 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 
            text-current focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-zinc-950 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-current'}
          `}
          style={{ color: customColor }}
          {...props}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor={checkboxId} className="text-sm font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer">
          {label}
        </label>
        {(errorText || helperText) && (
          <span className={`text-xs mt-1 ${hasError ? 'text-red-500 font-medium' : 'text-zinc-500'}`}>
            {errorText || helperText}
          </span>
        )}
      </div>
    </div>
  );
}