import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { FormVariant, ElementSize } from '../FieldWrapper';

export interface SelectProps {
  name: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  variant?: FormVariant; /* @select|default|filled|underlined */
  size?: ElementSize; /* @select|sm|md|lg */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'; /* @select|none|sm|md|lg|full */
  shadow?: 'none' | 'sm' | 'md' | 'lg'; /* @select|none|sm|md|lg */
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'; /* @select|blue|emerald|purple|rose|slate */
  options?: { label: string; value: string }[]; /* @type|json */
  value?: string; /* @type|string */
  onChangeValue?: (val: string) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  className?: string;
}

export default function Select({
  name,
  label,
  variant = 'default',
  size = 'md',
  radius = 'md',
  shadow = 'sm',
  colorScheme = 'blue',
  options = [],
  value,
  onChangeValue,
  required,
  className = ''
}: SelectProps) { /* @metadata A themed dropdown selection component supporting dynamic JSON options, various design variants, and smart sizing. */
  
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;

  const activeValue = isInsideForm ? (formContext.values[name] || '') : (value || '');
  const errorMessage = isInsideForm ? formContext.errors[name] : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  let selectClass = `w-full outline-none bg-transparent transition-all peer text-gray-900 dark:text-white cursor-pointer appearance-none ${ringColors[colorScheme]} `;
  
  // Custom SVG Chevron for a premium look
  const chevronBg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

  if (variant === 'default') {
    selectClass += `border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-4 ${sizeMap[size]} ${radiusMap[radius]} ${shadowMap[shadow]} `;
  } else if (variant === 'filled' || variant === 'underlined') {
    selectClass += "px-1 py-1.5 text-sm ";
  }

  if (errorMessage) {
    selectClass += " border-red-500 focus:border-red-500 focus:ring-red-500/20 ";
  }

  return (
    <FieldWrapper 
      label={label} 
      error={errorMessage} 
      required={required} 
      size={size}
      variant={variant === 'floating' ? 'default' : variant}
      className={className}
    >
      <div className="relative w-full">
        <select
          name={name}
          value={activeValue}
          onChange={handleChange}
          required={required}
          className={selectClass}
          style={{ backgroundImage: chevronBg, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
        >
          <option value="" disabled className="text-gray-400">Select an option...</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value} className="text-gray-900 dark:bg-gray-800 dark:text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </FieldWrapper>
  );
}