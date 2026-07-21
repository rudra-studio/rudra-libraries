import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  additionalAttributes?: Record<string, string>;

  /** * @type|class
   * @schema [{
   * "key": "Background",
   * "prefix": "bg",
   * "type": "select",
   * "options": [
   * {"key": "blue-600", "label": "Blue"},
   * {"key": "gray-600", "label": "Gray"},
   * {"key": "white", "label": "White"},
   * {"key": "transparent", "label": "Transparent"},
   * {"key": "red-600", "label": "Red"}
   * ]
   * },{
   * "key": "Text Color",
   * "prefix": "text",
   * "type": "select",
   * "options": [
   * {"key": "white", "label": "White"},
   * {"key": "gray-900", "label": "Dark"},
   * {"key": "gray-700", "label": "Gray"},
   * {"key": "blue-600", "label": "Blue"}
   * ]
   * },{
   * "key": "Radius",
   * "prefix": "rounded",
   * "type": "select",
   * "options": [
   * {"key": "none", "label": "Square"},
   * {"key": "md", "label": "Medium"},
   * {"key": "lg", "label": "Large"},
   * {"key": "full", "label": "Pill"}
   * ]
   * },{
   * "key": "Width",
   * "prefix": "w",
   * "type": "select",
   * "options": [
   * {"key": "auto", "label": "Auto"},
   * {"key": "full", "label": "Full Width"}
   * ]
   * }]
   */
  className?: string;
  onClick?: (Event: any) => void /* @type|function|return:void|args:event */
}

export default function Button({
  children = 'Click Me',
  leftIcon,
  rightIcon,
  type = 'button',
  additionalAttributes = {},
  // Set the "primary" look as the solid baseline default
  className = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  onClick,
  ...props
}: ButtonProps) {
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      {...additionalAttributes}
      {...props}
    >
      {leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
    </button>
  );
}