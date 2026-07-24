import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';

export interface RadioProps {
  name: string; /* @type|string */
  value: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  description?: string; /* @type|string|@translate */
  size?: ElementSize; /* @select|sm|md|lg */
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'; /* @select|blue|emerald|purple|rose|slate */
  checked?: boolean; /* @type|boolean */
  onChangeValue?: (val: string) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  className?: string;
}

export default function Radio({
  name,
  value,
  label,
  description,
  size = 'md',
  colorScheme = 'blue',
  checked = false,
  onChangeValue,
  required,
  className = ''
}: RadioProps) { /* @metadata A themed, single radio button component with an animated selection dot. Best used for custom layouts sharing a single name. */
  
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;

  // For a radio, it is active if the context value exactly matches this radio's specific value
  const isChecked = isInsideForm ? (formContext.values[name] === value) : checked;
  const errorMessage = isInsideForm ? formContext.errors[name] : undefined;

  const handleChange = () => {
    if (isInsideForm) formContext.handleChange(name, value);
    if (onChangeValue) onChangeValue(value);
  };

  // --- Design Dictionaries ---
  const sizeMap = {
    sm: { box: "w-4 h-4", text: "text-xs", dot: "w-1.5 h-1.5" },
    md: { box: "w-5 h-5", text: "text-sm", dot: "w-2 h-2" },
    lg: { box: "w-6 h-6", text: "text-base", dot: "w-2.5 h-2.5" }
  };

  const colorMap = {
    blue: "peer-checked:border-blue-600 peer-focus:ring-blue-500/20",
    emerald: "peer-checked:border-emerald-600 peer-focus:ring-emerald-500/20",
    purple: "peer-checked:border-purple-600 peer-focus:ring-purple-500/20",
    rose: "peer-checked:border-rose-600 peer-focus:ring-rose-500/20",
    slate: "peer-checked:border-slate-700 peer-focus:ring-slate-500/20"
  };

  const dotColorMap = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    purple: "bg-purple-600",
    rose: "bg-rose-600",
    slate: "bg-slate-700"
  };

  const dimensions = sizeMap[size];
  const errorClass = errorMessage ? "border-red-500" : "border-gray-300 dark:border-gray-600";

  return (
    <FieldWrapper error={errorMessage} className={className}>
      <label className="inline-flex items-start cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="radio"
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            required={required}
            className="peer sr-only"
          />
          {/* Outer Circle */}
          <div className={`flex items-center justify-center border-2 rounded-full bg-white dark:bg-gray-900 transition-all duration-200 peer-focus:ring-4 ${errorClass} ${dimensions.box} ${colorMap[colorScheme]}`}>
            {/* Inner Animated Dot */}
            <div className={`rounded-full transform scale-0 peer-checked:scale-100 transition-transform duration-200 ${dimensions.dot} ${dotColorMap[colorScheme]}`} />
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