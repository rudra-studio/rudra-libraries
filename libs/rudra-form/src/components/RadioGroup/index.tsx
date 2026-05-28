import React from 'react';

export type RadioOption = {
  label: string;
  value: string;
};

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string; 
  label?: string; /* @translate */
  options?: RadioOption[];
  direction?: 'col' | 'row'; /* @select|col|row */
  customColor?: string; /* @color */
  errorText?: string; /* @translate */
}

export default function RadioGroup({
  name = 'radiogroup',
  label = 'Select an option',
  options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ],
  direction = 'col',
  customColor = '#3b82f6',
  errorText,
  className = '',
  id,
  ...props
}: RadioGroupProps) {
  const groupId = id || React.useId();
  const hasError = !!errorText;

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`} {...props}>
      {label && (
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200" id={`${groupId}-label`}>
          {label}
        </span>
      )}
      
      <div 
        role="radiogroup" 
        aria-labelledby={`${groupId}-label`}
        className={`flex ${direction === 'row' ? 'flex-row flex-wrap gap-6' : 'flex-col gap-3'}`}
      >
        {options.map((opt, i) => {
          const radioId = `${groupId}-opt-${i}`;
          return (
            <div key={opt.value} className="flex items-center gap-2">
              <input
                id={radioId}
                type="radio"
                name={name}
                value={opt.value}
                className={`
                  w-4 h-4 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 
                  text-current focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-zinc-950 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${hasError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-current'}
                `}
                style={{ color: customColor }}
              />
              <label htmlFor={radioId} className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>

      {errorText && <span className="text-xs text-red-500 font-medium">{errorText}</span>}
    </div>
  );
}