import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode; // The default 'idle' text
  status?: ButtonStatus; /* @select|idle|loading|success|error */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; /* @select|primary|secondary|danger|ghost */
  size?: 'sm' | 'md' | 'lg'; /* @select|sm|md|lg */
  fullWidth?: boolean; /* @select|true|false */
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

// Internal zero-dependency micro-icons
const Spinner = () => (
  <motion.svg 
    animate={{ rotate: 360 }} 
    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </motion.svg>
);

const CheckIcon = () => (
  <motion.svg 
    initial={{ pathLength: 0, opacity: 0 }} 
    animate={{ pathLength: 1, opacity: 1 }} 
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-4 h-4 shrink-0 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </motion.svg>
);

const AlertIcon = () => (
  <motion.svg 
    initial={{ scale: 0 }} animate={{ scale: 1 }}
    className="w-4 h-4 shrink-0 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </motion.svg>
);

export default function AnimatedButton({
  children = 'Submit',
  status = 'idle',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loadingText = 'Saving...',
  successText = 'Saved!',
  errorText = 'Failed',
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) {

  // 1. Style Dictionaries
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
    md: 'px-4 py-2 text-sm gap-2 rounded-lg',
    lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
  }[size];

  const variantColors = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  }[variant];

  // Override background colors dynamically if resolved into an end-state
  const getStateColorOverride = () => {
    if (status === 'success') return '!bg-emerald-600 !text-white pointer-events-none';
    if (status === 'error') return '!bg-rose-600 !text-white pointer-events-none';
    if (status === 'loading') return 'pointer-events-none opacity-90';
    return variantColors;
  };

  // 2. Resolve Current UI Content
  const getContent = () => {
    switch (status) {
      case 'loading':
        return (
          <React.Fragment key="loading">
            <Spinner />
            <span>{loadingText}</span>
          </React.Fragment>
        );
      case 'success':
        return (
          <React.Fragment key="success">
            <CheckIcon />
            <span>{successText}</span>
          </React.Fragment>
        );
      case 'error':
        return (
          <React.Fragment key="error">
            <AlertIcon />
            <span>{errorText}</span>
          </React.Fragment>
        );
      default:
        return <span key="idle">{children}</span>;
    }
  };

  return (
    <motion.button
      layout // Instructs Framer to morph the outer shell width smoothly
      whileTap={status === 'idle' ? { scale: 0.98 } : undefined}
      transition={{ 
        layout: { type: "spring", stiffness: 450, damping: 30 } 
      }}
      disabled={disabled || status !== 'idle'}
      className={`
        relative inline-flex items-center justify-center font-medium
        transition-colors duration-200 select-none overflow-hidden
        ${fullWidth ? 'w-full' : 'w-fit'}
        ${sizeClasses}
        ${getStateColorOverride()}
        ${className}
      `}
      {...props}
    >
      {/* popLayout instantly takes exiting text out of document flow so incoming text centers instantly */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={status}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="flex items-center justify-center gap-inherit"
        >
          {getContent()}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}