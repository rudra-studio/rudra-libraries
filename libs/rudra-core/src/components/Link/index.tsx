import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** The visual style of the link */
  variant?: 'default' | 'muted' | 'button-solid' | 'button-outline' | 'button-ghost';
  /** Controls text size and button padding */
  size?: 'sm' | 'base' | 'lg';
  /** Controls underline behavior (mainly for text variants) */
  underline?: 'none' | 'hover' | 'always';
  /** Auto-applies target="_blank" and rel="noopener noreferrer" for security */
  isExternal?: boolean;
  /** Optional icon to render before the text */
  leftIcon?: React.ReactNode;
  /** Optional icon to render after the text */
  rightIcon?: React.ReactNode;
  /** * Allows overriding the underlying DOM element. 
   * Extremely useful for Next.js (<Link>) or React Router compatibility.
   */
  as?: React.ElementType; 
  className?: string;
}

export default function Link({
  href,
  children,
  variant = 'default',
  size = 'base',
  underline = 'hover',
  isExternal = false,
  leftIcon,
  rightIcon,
  as: Component = 'a',
  className = '',
  ...props
}: LinkProps) {
  
  const isButtonVariant = variant.startsWith('button');

  // --- BASE STYLES ---
  // inline-flex handles icon alignments perfectly. 
  // focus-visible ensures accessibility rings only show on keyboard navigation, not mouse clicks.
  const baseClasses = 'inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';

  // --- VARIANT STYLES ---
  const variantClasses: Record<string, string> = {
    // Text variants
    'default': 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium',
    'muted': 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
    
    // Button variants
    'button-solid': 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md font-semibold rounded-lg border border-transparent',
    'button-outline': 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/50 font-semibold rounded-lg',
    'button-ghost': 'text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50 font-semibold rounded-lg',
  };

  // --- SIZE STYLES ---
  const sizeClasses: Record<string, string> = {
    'sm': isButtonVariant ? 'text-sm px-3 py-1.5' : 'text-sm',
    'base': isButtonVariant ? 'text-base px-4 py-2' : 'text-base',
    'lg': isButtonVariant ? 'text-lg px-6 py-3' : 'text-lg',
  };

  // --- UNDERLINE STYLES ---
  const underlineClasses: Record<string, string> = {
    'none': 'no-underline',
    'hover': isButtonVariant ? '' : 'hover:underline underline-offset-4',
    'always': isButtonVariant ? '' : 'underline underline-offset-4',
  };

  // --- SECURITY ATTRIBUTES ---
  const externalProps = isExternal ? { 
    target: '_blank', 
    rel: 'noopener noreferrer' 
  } : {};

  // Cleanly compile the final class string
  const finalClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${underlineClasses[underline]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component 
      href={href}
      className={finalClassName}
      {...externalProps}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      {/* If it's an external link without a rightIcon, auto-append a tiny 
        external arrow for best UX practices. 
      */}
      {isExternal && !rightIcon && !isButtonVariant && (
        <svg className="w-3 h-3 ml-0.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </Component>
  );
}