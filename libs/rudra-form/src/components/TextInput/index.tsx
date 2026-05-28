import React from 'react';
import * as LucideIcons from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; /* @translate */
  placeholder?: string; /* @translate */
  helperText?: string; /* @translate */
  errorText?: string; /* @translate */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'; /* @select|text|email|password|number|tel|url */
  leftIconName?: string; /* @icon */
  rightIconName?: string; /* @icon */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'; /* @select|none|sm|md|lg|full */
}

export default function TextInput({
  label,
  placeholder,
  helperText,
  errorText,
  type = 'text',
  leftIconName,
  rightIconName,
  radius = 'md',
  className = '',
  id,
  ...props
}: TextInputProps) {
  // Generate a stable ID if the user didn't provide one, critical for screen readers
  const inputId = id || React.useId();
  const hasError = !!errorText;

  const LeftIcon = leftIconName ? (LucideIcons as any)[leftIconName] : null;
  const RightIcon = rightIconName ? (LucideIcons as any)[rightIconName] : null;

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {LeftIcon && (
          <div className="absolute left-3 text-zinc-400">
            <LeftIcon size={16} strokeWidth={2} />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          aria-invalid={hasError}
          className={`
            w-full py-2 text-sm bg-white dark:bg-zinc-900 border shadow-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-zinc-950
            disabled:opacity-50 disabled:cursor-not-allowed
            ${radiusClasses[radius]}
            ${LeftIcon ? 'pl-9' : 'pl-3'}
            ${RightIcon ? 'pr-9' : 'pr-3'}
            ${hasError 
              ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:text-red-400 dark:placeholder-red-900' 
              : 'border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500'}
            ${className}
          `}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 text-zinc-400">
            <RightIcon size={16} strokeWidth={2} />
          </div>
        )}
      </div>

      {(errorText || helperText) && (
        <span className={`text-xs ${hasError ? 'text-red-500 font-medium' : 'text-zinc-500'}`}>
          {errorText || helperText}
        </span>
      )}
    </div>
  );
}