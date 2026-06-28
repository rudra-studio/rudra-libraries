import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs?: TabItem[]; /* @array */
  defaultActiveId?: string;
  variant?: 'pill' | 'underline'; /* @select|pill|underline */
  size?: 'sm' | 'md' | 'lg'; /* @select|sm|md|lg */
  fullWidth?: boolean; /* @select|true|false */
  onChange?: (id: string) => void;
}

export default function AnimatedTabs({
  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'settings', label: 'Settings' },
    { id: 'billing', label: 'Billing' },
  ],
  defaultActiveId,
  variant = 'pill',
  size = 'md',
  fullWidth = false,
  onChange,
  className = '',
  ...props
}: AnimatedTabsProps) {
  // If no default is provided, default to the first tab
  const [activeTab, setActiveTab] = useState(defaultActiveId || tabs[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  // 1. Style Dictionaries
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  const containerClasses = variant === 'pill' 
    ? 'bg-slate-100/80 p-1 rounded-xl backdrop-blur-sm' 
    : 'border-b border-slate-200 gap-4';

  return (
    <div 
      role="tablist"
      className={`relative flex items-center ${containerClasses} ${fullWidth ? 'w-full justify-between' : 'w-fit'} ${className}`}
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabClick(tab.id)}
            className={`
              relative flex items-center justify-center font-medium transition-colors duration-200 outline-none
              ${fullWidth ? 'flex-1' : ''}
              ${sizeClasses}
              ${variant === 'pill' ? 'rounded-lg' : ''}
              ${isActive 
                ? (variant === 'pill' ? 'text-slate-900' : 'text-blue-600') 
                : 'text-slate-500 hover:text-slate-700'
              }
            `}
          >
            {/* The Text / Icon Content (Raised above the background via z-index) */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>

            {/* The Animated Active Indicator */}
            {isActive && (
              <motion.div
                layoutId={`active-tab-indicator-${variant}`}
                className={`
                  absolute ${variant === 'pill' 
                    ? 'inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50' 
                    : 'bottom-0 left-0 right-0 h-[2px] bg-blue-600'
                  }
                `}
                // Premium spring physics for the slide effect
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}