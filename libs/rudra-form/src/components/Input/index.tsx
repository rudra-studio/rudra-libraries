import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { FormVariant, ElementSize } from '../FieldWrapper';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size'> {
  name: string; /* @type|string */
  label?: string; /* @type|string|@translate */
  variant?: FormVariant; /* @select|default|filled|floating|underlined */
  size?: ElementSize; /* @select|sm|md|lg */
  value?: string; /* @type|string */
  onChangeValue?: (val: string) => void; /* @type|function|args:value */
  required?: boolean; /* @type|boolean */
  placeholder?: string; /* @type|string|@translate */
  type?: string; /* @select|text|email|password|number|url */
  icon?: React.ReactNode; /* @type|node */
  iconPosition?: 'start' | 'end'; /* @select|start|end */
  
  /** * @type|class
   * @schema [{
   * "key": "Radius",
   * "prefix": "rounded",
   * "type": "select",
   * "options": [
   * {"key": "none", "label": "None"},
   * {"key": "sm", "label": "Small"},
   * {"key": "md", "label": "Medium"},
   * {"key": "full", "label": "Full"}
   * ]
   * },{
   * "key": "Shadow",
   * "prefix": "shadow",
   * "type": "select",
   * "options": [
   * {"key": "none", "label": "None"},
   * {"key": "sm", "label": "Small"},
   * {"key": "md", "label": "Medium"}
   * ]
   * },{
   * "key": "Background",
   * "prefix": "bg",
   * "type": "select",
   * "options": [
   * {"key": "transparent", "label": "Transparent"},
   * {"key": "white dark:bg-gray-900", "label": "Solid"},
   * {"key": "gray-50 dark:bg-gray-800", "label": "Subtle"}
   * ]
   * }]
   */
  className?: string;
}

export default function Input({
  name,
  label,
  variant = 'default',
  size = 'md',
  required,
  value,
  onChangeValue,
  className = 'rounded-md shadow-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-500',
  type = 'text',
  placeholder,
  icon,
  iconPosition = 'start',
  ...props
}: InputProps) { /* @metadata A lean, highly customizable text input. Relies on class injection for themes and styling while managing structural layout for variants and icons. */
  
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;

  const activeValue = isInsideForm ? (formContext.values[name] || '') : (value || '');
  const errorMessage = isInsideForm ? formContext.errors[name] : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isInsideForm) formContext.handleChange(name, val);
    if (onChangeValue) onChangeValue(val);
  };

  const sizeMap = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
  };

  const iconPaddingMap = {
    start: { sm: "pl-8", md: "pl-10", lg: "pl-11" },
    end: { sm: "pr-8", md: "pr-10", lg: "pr-11" }
  };

  const iconPosMap = {
    start: { sm: "left-2.5", md: "left-3", lg: "left-3.5" },
    end: { sm: "right-2.5", md: "right-3", lg: "right-3.5" }
  };

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-5 h-5" 
  };

  let inputClass = `w-full outline-none transition-all peer text-gray-900 dark:text-white ${className} `;
  
  if (variant === 'default') {
    inputClass += `border focus:ring-4 ${sizeMap[size]} `;
  } else if (variant === 'floating') {
    inputClass += `border focus:ring-4 placeholder-transparent ${sizeMap[size]} `;
  } else if (variant === 'filled' || variant === 'underlined') {
    inputClass += "px-1 py-1.5 text-sm bg-transparent ";
  }

  if (icon) {
    inputClass += `${iconPaddingMap[iconPosition][size]} `;
  }

  if (errorMessage) {
    inputClass += " !border-red-500 focus:!border-red-500 focus:!ring-red-500/20 ";
  }

  return (
    <FieldWrapper label={label} error={errorMessage} required={required} variant={variant} size={size}>
      <div className="relative w-full flex items-center">
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
        
        {icon && (
          <div className={`absolute ${iconPosMap[iconPosition][size]} text-gray-400 dark:text-gray-500 transition-colors pointer-events-none flex items-center justify-center ${iconSizeMap[size]} ${errorMessage ? '!text-red-500' : 'peer-focus:text-gray-900 dark:peer-focus:text-white'}`}>
            {icon}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}