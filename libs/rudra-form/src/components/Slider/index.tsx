import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';

export interface SliderProps {
  name: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  min?: number; /* @type|number */
  max?: number; /* @type|number */
  step?: number; /* @type|number */
  value?: number; /* @type|number */
  size?: ElementSize; /* @select|sm|md|lg */
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'; /* @select|blue|emerald|purple|rose|slate */
  onChangeValue?: (val: number) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  className?: string;
}

export default function Slider({
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  size = 'md',
  colorScheme = 'blue',
  onChangeValue,
  required,
  className = ''
}: SliderProps) { /* @metadata A themed visual range slider component supporting custom step increments, track filling, and context binding. */
  
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;

  const activeValue = isInsideForm ? (formContext.values[name] ?? value) : value;
  const errorMessage = isInsideForm ? formContext.errors[name] : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (isInsideForm) formContext.handleChange(name, val);
    if (onChangeValue) onChangeValue(val);
  };

  // 1. Calculate the percentage for the track fill
  const range = max - min;
  const percentage = range === 0 ? 0 : ((activeValue - min) / range) * 100;

  // 2. Map Tailwind themes to exact Hex codes for the CSS gradient fill
  const hexMap = {
    blue: '#2563eb',    // blue-600
    emerald: '#059669', // emerald-600
    purple: '#9333ea',  // purple-600
    rose: '#e11d48',    // rose-600
    slate: '#334155'    // slate-700
  };

  const accentColor = hexMap[colorScheme] || hexMap.blue;

  // Tailwind accent classes (keeps the drag thumb colored correctly)
  const accentMap = {
    blue: "accent-blue-600 dark:accent-blue-500",
    emerald: "accent-emerald-600 dark:accent-emerald-500",
    purple: "accent-purple-600 dark:accent-purple-500",
    rose: "accent-rose-600 dark:accent-rose-500",
    slate: "accent-slate-700 dark:accent-slate-400"
  };

  const heightMap = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <FieldWrapper label={label} error={errorMessage} required={required} size={size} className={className}>
      <div className="flex items-center gap-4 mt-1">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={activeValue}
          onChange={handleChange}
          className={`w-full bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 ${heightMap[size]} ${accentMap[colorScheme]}`}
          style={{
            // 🚀 The Magic Trick: Uses a background image that only covers the 'filled' percentage
            backgroundImage: `linear-gradient(${accentColor}, ${accentColor})`,
            backgroundSize: `${percentage}% 100%`,
            backgroundRepeat: 'no-repeat'
          }}
        />
        <span className={`font-mono font-medium text-gray-700 dark:text-gray-300 w-10 text-right shrink-0 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          {activeValue}
        </span>
      </div>
    </FieldWrapper>
  );
}