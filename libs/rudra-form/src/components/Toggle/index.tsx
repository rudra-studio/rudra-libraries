import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';

export interface ToggleProps {
  name: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  description?: string; /* @type|string|@translate */
  size?: ElementSize; /* @select|sm|md|lg */
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'; /* @select|blue|emerald|purple|rose|slate */
  value?: boolean; /* @type|boolean */
  onChangeValue?: (val: boolean) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  className?: string;
}

export default function Toggle({
  name,
  label,
  description,
  size = 'md',
  colorScheme = 'blue',
  value = false,
  onChangeValue,
  required,
  className = ''
}: ToggleProps) { /* @metadata An animated toggle switch component for boolean selections. Supports scaling sizes and color themes. */
  
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
    sm: { track: "w-9 h-5", thumb: "h-4 w-4", translate: "peer-checked:translate-x-4", text: "text-xs" },
    md: { track: "w-11 h-6", thumb: "h-5 w-5", translate: "peer-checked:translate-x-5", text: "text-sm" },
    lg: { track: "w-14 h-7", thumb: "h-6 w-6", translate: "peer-checked:translate-x-7", text: "text-base" }
  };

  const colorMap = {
    blue: "peer-checked:bg-blue-600 peer-focus:ring-blue-500/20",
    emerald: "peer-checked:bg-emerald-600 peer-focus:ring-emerald-500/20",
    purple: "peer-checked:bg-purple-600 peer-focus:ring-purple-500/20",
    rose: "peer-checked:bg-rose-600 peer-focus:ring-rose-500/20",
    slate: "peer-checked:bg-slate-700 peer-focus:ring-slate-500/20"
  };

  const dimensions = sizeMap[size];

  return (
    <FieldWrapper error={errorMessage} className={className}>
      <label className="inline-flex items-center cursor-pointer group">
        <input
          type="checkbox"
          name={name}
          checked={!!activeValue}
          onChange={handleChange}
          required={required}
          className="sr-only peer"
        />
        <div className={`relative bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 transition-colors duration-300 ${dimensions.track} ${colorMap[colorScheme]}`}>
          <div className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full transition-all duration-300 ${dimensions.thumb} ${dimensions.translate}`}></div>
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