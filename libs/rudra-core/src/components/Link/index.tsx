import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
  /** Auto-applies target="_blank" and rel="noopener noreferrer" for security */
  isExternal?: boolean;
  /** Optional icon to render before the text */
  leftIcon?: React.ReactNode; /* @icon */
  /** Optional icon to render after the text */
  rightIcon?: React.ReactNode; /* @icon */
  /** 
   * Allows overriding the underlying DOM element. 
   * Extremely useful for Next.js (<Link>) or React Router compatibility.
   */
  as?: React.ElementType; 
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>; 

  /** * @type|class
   * @schema [{
   * "key": "Theme",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium", "label": "Text (Default)"},
   * {"key": "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium", "label": "Text (Muted)"},
   * {"key": "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md font-semibold rounded-lg border border-transparent", "label": "Button (Solid)"},
   * {"key": "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/50 font-semibold rounded-lg", "label": "Button (Outline)"},
   * {"key": "text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50 font-semibold rounded-lg", "label": "Button (Ghost)"}
   * ]
   * },{
   * "key": "Size",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "text-sm", "label": "Text Small"},
   * {"key": "text-base", "label": "Text Base"},
   * {"key": "text-lg", "label": "Text Large"},
   * {"key": "text-sm px-3 py-1.5", "label": "Button Small"},
   * {"key": "text-base px-4 py-2", "label": "Button Base"},
   * {"key": "text-lg px-6 py-3", "label": "Button Large"}
   * ]
   * },{
   * "key": "Underline",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "no-underline", "label": "None"},
   * {"key": "hover:underline underline-offset-4", "label": "On Hover"},
   * {"key": "underline underline-offset-4", "label": "Always"}
   * ]
   * }]
   */
  className?: string;
}

export default function Link({
  href = '#',
  children = 'Click here',
  isExternal = false,
  leftIcon,
  rightIcon,
  as: Component = 'a',
  customAttributes = {},
  // Set the default interactive link baseline (includes focus rings + default text colors)
  className = 'inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-base hover:underline underline-offset-4',
  ...props
}: LinkProps) {
  
  // --- SECURITY ATTRIBUTES ---
  const externalProps = isExternal ? { 
    target: '_blank', 
    rel: 'noopener noreferrer' 
  } : {};

  return (
    <Component 
      href={href}
      className={className}
      {...externalProps}
      {...customAttributes}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      {/* If it's an external link without a rightIcon, auto-append a tiny 
        external arrow for best UX practices. 
      */}
      {isExternal && !rightIcon && (
        <svg className="w-3 h-3 ml-0.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </Component>
  );
}