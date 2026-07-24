import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { FormVariant, ElementSize } from '../FieldWrapper';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size'> {
  name: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  variant?: FormVariant; /* @select|default|filled|floating|underlined */
  size?: ElementSize; /* @select|sm|md|lg */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'; /* @select|none|sm|md|lg|full */
  shadow?: 'none' | 'sm' | 'md' | 'lg'; /* @select|none|sm|md|lg */
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'; /* @select|blue|emerald|purple|rose|slate */
  value?: string; /* @type|string */
  onChangeValue?: (val: string) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  placeholder?: string; /* @type|string|@translate */
  type?: string; /* @select|text|email|password|number|url */
}

export default function Input({
  name,
  label,
  variant = 'default',
  size = 'md',
  radius = 'md',
  shadow = 'sm',
  colorScheme = 'blue',
  required,
  value,
  onChangeValue,
  className = '',
  type = 'text',
  placeholder,
  ...props
}: InputProps) { /* @metadata A highly customizable text input supporting varying sizes, border radii, shadows, and color themes. */
  
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;

  const activeValue = isInsideForm ? (formContext.values[name] || '') : (value || '');
  const errorMessage = isInsideForm ? formContext.errors[name] : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isInsideForm) formContext.handleChange(name, val);
    if (onChangeValue) onChangeValue(val);
  };

  // --- Design Dictionaries ---
  const sizeMap = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
  };

  const radiusMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  };

  const shadowMap = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-md"
  };

  const ringColors = {
    blue: "focus:ring-blue-500/20 focus:border-blue-500",
    emerald: "focus:ring-emerald-500/20 focus:border-emerald-500",
    purple: "focus:ring-purple-500/20 focus:border-purple-500",
    rose: "focus:ring-rose-500/20 focus:border-rose-500",
    slate: "focus:ring-slate-500/20 focus:border-slate-500",
  };

  // --- Base Styling Assembly ---
  let inputClass = `w-full outline-none bg-transparent transition-all peer text-gray-900 dark:text-white ${ringColors[colorScheme]} `;
  
  if (variant === 'default') {
    inputClass += `border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-4 ${sizeMap[size]} ${radiusMap[radius]} ${shadowMap[shadow]} `;
  } else if (variant === 'floating') {
    inputClass += `border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-4 placeholder-transparent ${sizeMap[size]} ${radiusMap[radius]} ${shadowMap[shadow]} `;
  } else if (variant === 'filled' || variant === 'underlined') {
    // Filled and Underlined rely on the wrapper for their background/borders
    inputClass += "px-1 py-1.5 text-sm ";
  }

  // Error Override
  if (errorMessage) {
    inputClass += " border-red-500 focus:border-red-500 focus:ring-red-500/20 ";
  }

  return (
    <FieldWrapper label={label} error={errorMessage} required={required} variant={variant} size={size} className={className}>
      <input
        name={name}
        type={type}
        value={activeValue}
        onChange={handleChange}
        required={required}
        placeholder={variant === 'floating' ? ' ' : placeholder}
        className={inputClass}
        {...props}
      />
    </FieldWrapper>
  );
}