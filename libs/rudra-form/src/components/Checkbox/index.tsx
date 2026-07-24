import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';

export interface CheckboxProps {
  name: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  description?: string; /* @type|string|@translate */
  size?: ElementSize; /* @select|sm|md|lg */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'; /* @select|none|sm|md|lg|full */
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'; /* @select|blue|emerald|purple|rose|slate */
  value?: boolean; /* @type|boolean */
  onChangeValue?: (val: boolean) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  className?: string;
}

export default function Checkbox({
  name,
  label,
  description,
  size = 'md',
  radius = 'md',
  colorScheme = 'blue',
  value = false,
  onChangeValue,
  required,
  className = ''
}: CheckboxProps) { /* @metadata A single themed checkbox with an animated SVG checkmark. Supports custom border radii for square or circular designs. */
  
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;

  const activeValue = isInsideForm ? (formContext.values[name] ?? value) : value;
  const errorMessage = isInsideForm ? formContext.errors[name] : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    if (isInsideForm) formContext.handleChange(name, val);
    if (onChangeValue) onChangeValue(val);
  };

  // --- Design Dictionaries ---
  const sizeMap = {
    sm: { box: "w-4 h-4", text: "text-xs", svg: "w-2.5 h-2.5" },
    md: { box: "w-5 h-5", text: "text-sm", svg: "w-3.5 h-3.5" },
    lg: { box: "w-6 h-6", text: "text-base", svg: "w-4 h-4" }
  };

  const radiusMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-md",
    full: "rounded-full"
  };

  const colorMap = {
    blue: "peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-focus:ring-blue-500/20 text-white",
    emerald: "peer-checked:bg-emerald-600 peer-checked:border-emerald-600 peer-focus:ring-emerald-500/20 text-white",
    purple: "peer-checked:bg-purple-600 peer-checked:border-purple-600 peer-focus:ring-purple-500/20 text-white",
    rose: "peer-checked:bg-rose-600 peer-checked:border-rose-600 peer-focus:ring-rose-500/20 text-white",
    slate: "peer-checked:bg-slate-700 peer-checked:border-slate-700 peer-focus:ring-slate-500/20 text-white"
  };

  const dimensions = sizeMap[size];
  const errorClass = errorMessage ? "border-red-500" : "border-gray-300 dark:border-gray-600";

  return (
    <FieldWrapper error={errorMessage} className={className}>
      <label className="inline-flex items-start cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            name={name}
            checked={!!activeValue}
            onChange={handleChange}
            required={required}
            className="peer sr-only"
          />
          <div className={`flex items-center justify-center border-2 bg-white dark:bg-gray-900 transition-all duration-200 peer-focus:ring-4 ${errorClass} ${dimensions.box} ${radiusMap[radius]} ${colorMap[colorScheme]}`}>
            <svg
              className={`opacity-0 peer-checked:opacity-100 transition-opacity duration-200 ${dimensions.svg}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {(label || description) && (
          <div className="ml-3 flex flex-col">
            {label && (
              <span className={`font-medium text-gray-900 dark:text-gray-100 ${dimensions.text}`}>
                {label} {required && <span className="text-red-500">*</span>}
              </span>
            )}
            {description && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    </FieldWrapper>
  );
}