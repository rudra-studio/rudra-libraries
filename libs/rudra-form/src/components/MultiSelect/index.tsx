import React, { useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';

export interface CheckboxGroupProps {
  name: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  options?: { label: string; value: string; description?: string }[]; /* @type|json */
  layout?: 'vertical' | 'horizontal'; /* @select|vertical|horizontal */
  size?: ElementSize; /* @select|sm|md|lg */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'; /* @select|none|sm|md|lg|full */
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'; /* @select|blue|emerald|purple|rose|slate */
  value?: string[]; /* @type|array */
  searchable?: boolean; /* @type|boolean */
  onChangeValue?: (val: string[]) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  className?: string;
}

export default function CheckboxGroup({
  name,
  label,
  options = [],
  layout = 'vertical',
  size = 'md',
  radius = 'md',
  colorScheme = 'blue',
  value = [],
  searchable = false,
  onChangeValue,
  required,
  className = ''
}: CheckboxGroupProps) { /* @metadata A group of themed checkboxes acting as a multi-select field. Includes an optional real-time search filter for large option lists. */
  
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;
  const [searchQuery, setSearchQuery] = useState('');

  // The active value is ALWAYS an array here
  const activeValue: string[] = Array.isArray(isInsideForm ? formContext.values[name] : value) 
    ? (isInsideForm ? formContext.values[name] : value) 
    : [];
    
  const errorMessage = isInsideForm ? formContext.errors[name] : undefined;

  const handleChange = (optionValue: string, isChecked: boolean) => {
    let nextValue = [...activeValue];
    
    if (isChecked) {
      if (!nextValue.includes(optionValue)) nextValue.push(optionValue);
    } else {
      nextValue = nextValue.filter(v => v !== optionValue);
    }

    if (isInsideForm) formContext.handleChange(name, nextValue);
    if (onChangeValue) onChangeValue(nextValue);
  };

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (opt.description && opt.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- Design Dictionaries ---
  const sizeMap = {
    sm: { box: "w-4 h-4", text: "text-xs", svg: "w-2.5 h-2.5", gap: "gap-2" },
    md: { box: "w-5 h-5", text: "text-sm", svg: "w-3.5 h-3.5", gap: "gap-3" },
    lg: { box: "w-6 h-6", text: "text-base", svg: "w-4 h-4", gap: "gap-4" }
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

  const searchRingColors = {
    blue: "focus:ring-blue-500/20 focus:border-blue-500",
    emerald: "focus:ring-emerald-500/20 focus:border-emerald-500",
    purple: "focus:ring-purple-500/20 focus:border-purple-500",
    rose: "focus:ring-rose-500/20 focus:border-rose-500",
    slate: "focus:ring-slate-500/20 focus:border-slate-500",
  };

  const dimensions = sizeMap[size];
  const errorClass = errorMessage ? "border-red-500" : "border-gray-300 dark:border-gray-600";
  const layoutClass = layout === 'vertical' ? "flex flex-col gap-3" : "flex flex-wrap gap-4";

  return (
    <FieldWrapper label={label} error={errorMessage} required={required} size={size} className={className}>
      
      {searchable && options.length > 0 && (
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search options..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white outline-none transition-all ${searchRingColors[colorScheme]}`}
          />
        </div>
      )}

      <div className={layoutClass}>
        {filteredOptions.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic py-2">
            No options found.
          </div>
        ) : (
          filteredOptions.map((opt, i) => {
            const isChecked = activeValue.includes(opt.value);
            return (
              <label key={i} className="inline-flex items-start cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleChange(opt.value, e.target.checked)}
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
          })
        )}
      </div>
    </FieldWrapper>
  );
}