import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';

export interface RadioGroupProps {
  name: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  options?: { label: string; value: string; description?: string }[]; /* @type|json */
  layout?: 'vertical' | 'horizontal'; /* @select|vertical|horizontal */
  size?: ElementSize; /* @select|sm|md|lg */
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'; /* @select|blue|emerald|purple|rose|slate */
  value?: string; /* @type|string */
  onChangeValue?: (val: string) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  className?: string;
}

export default function RadioGroup({
  name,
  label,
  options = [],
  layout = 'vertical',
  size = 'md',
  colorScheme = 'blue',
  value = '',
  onChangeValue,
  required,
  className = ''
}: RadioGroupProps) { /* @metadata A themed group of radio buttons for single-choice selections. Automatically maps JSON options to a vertical or horizontal layout. */
  
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;

  const activeValue = isInsideForm ? (formContext.values[name] || '') : (value || '');
  const errorMessage = isInsideForm ? formContext.errors[name] : undefined;

  const handleChange = (optionValue: string) => {
    if (isInsideForm) formContext.handleChange(name, optionValue);
    if (onChangeValue) onChangeValue(optionValue);
  };

  // --- Design Dictionaries ---
  const sizeMap = {
    sm: { box: "w-4 h-4", text: "text-xs", dot: "w-1.5 h-1.5", gap: "gap-2" },
    md: { box: "w-5 h-5", text: "text-sm", dot: "w-2 h-2", gap: "gap-3" },
    lg: { box: "w-6 h-6", text: "text-base", dot: "w-2.5 h-2.5", gap: "gap-4" }
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
  const layoutClass = layout === 'vertical' ? "flex flex-col gap-3" : "flex flex-wrap gap-5";

  return (
    <FieldWrapper label={label} error={errorMessage} required={required} size={size} className={className}>
      <div className={layoutClass}>
        {options.map((opt, i) => {
          const isChecked = activeValue === opt.value;
          return (
            <label key={i} className="inline-flex items-start cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isChecked}
                  onChange={() => handleChange(opt.value)}
                  className="peer sr-only"
                />
                {/* Outer Circle */}
                <div className={`flex items-center justify-center border-2 rounded-full bg-white dark:bg-gray-900 transition-all duration-200 peer-focus:ring-4 ${errorClass} ${dimensions.box} ${colorMap[colorScheme]}`}>
                   {/* Inner Animated Dot */}
                  <div className={`rounded-full transform scale-0 peer-checked:scale-100 transition-transform duration-200 ${dimensions.dot} ${dotColorMap[colorScheme]}`} />
                </div>
              </div>

              <div className="ml-3 flex flex-col">
                <span className={`font-medium text-gray-900 dark:text-gray-100 ${dimensions.text}`}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}