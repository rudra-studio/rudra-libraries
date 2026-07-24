import React from 'react';

export type FormVariant = 'default' | 'filled' | 'floating' | 'underlined';
export type ElementSize = 'sm' | 'md' | 'lg';

export interface FieldWrapperProps {
  label?: string; /* @type|string */
  error?: string; /* @type|string */
  required?: boolean; /* @type|boolean */
  variant?: FormVariant; /* @select|default|filled|floating|underlined */
  size?: ElementSize; /* @select|sm|md|lg */
  children: React.ReactNode; /* @type|node */
  className?: string;
}

export default function FieldWrapper({
  label,
  error,
  required,
  variant = 'default',
  size = 'md',
  children,
  className = ''
}: FieldWrapperProps) { /* @metadata A highly customizable universal wrapper for form fields supporting scaling sizes, variants, and validation states. */
  
  const sizeMap = {
    sm: "mb-3",
    md: "mb-4",
    lg: "mb-5"
  };

  const labelSizeMap = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };

  let containerClass = `flex flex-col w-full relative ${sizeMap[size]} `;
  let labelClass = `font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ${labelSizeMap[size]} `;

  if (variant === 'floating') {
    containerClass = `relative w-full ${sizeMap[size]} `;
    // Floating label requires precise translation based on size
    const floatTop = size === 'sm' ? 'top-1.5' : size === 'lg' ? 'top-3' : 'top-2';
    labelClass = `absolute ${labelSizeMap[size]} text-gray-500 duration-300 transform -translate-y-4 scale-75 ${floatTop} z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:${floatTop} peer-focus:scale-75 peer-focus:-translate-y-4 left-1 `;
  } else if (variant === 'filled') {
    containerClass += "bg-gray-50 dark:bg-gray-800/80 p-2 border-b-2 border-gray-300 focus-within:border-blue-600 rounded-t-md transition-colors ";
    labelClass = `text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-0.5 `;
  } else if (variant === 'underlined') {
    containerClass += "border-b-2 border-gray-200 dark:border-gray-700 focus-within:border-blue-600 dark:focus-within:border-blue-500 pb-1 transition-colors ";
  }

  return (
    <div className={`${containerClass} ${className}`}>
      {label && variant !== 'floating' && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      {children}

      {label && variant === 'floating' && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {error && (
        <span className="text-[10px] text-red-500 mt-1.5 font-medium flex items-center gap-1 animate-pulse">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </span>
      )}
    </div>
  );
}