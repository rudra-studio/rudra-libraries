import React, { useState, useId } from 'react';
import { motion } from 'motion/react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode; /* @icon */
}

export interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs?: TabItem[]; /* @array */
  defaultActiveId?: string;
  onChange?: (id: string) => void;

  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>;

  /**
   * Container Styles
   * @type|class
   * @schema [{
   * "key": "Theme",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "bg-slate-100/80 p-1 rounded-xl backdrop-blur-sm gap-1", "label": "Pill Container"},
   * {"key": "border-b border-slate-200 gap-4", "label": "Underline Container"}
   * ]
   * },{
   * "key": "Width",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "w-fit", "label": "Auto"},
   * {"key": "w-full justify-between", "label": "Full Width"}
   * ]
   * }]
   */
  className?: string;

  /**
   * Base Tab Button Styles
   * @type|class
   * @schema [{
   * "key": "Size",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "px-3 py-1.5 text-sm", "label": "Small"},
   * {"key": "px-4 py-2 text-base", "label": "Medium"},
   * {"key": "px-6 py-3 text-lg", "label": "Large"}
   * ]
   * },{
   * "key": "Rounding",
   * "prefix": "rounded",
   * "type": "select",
   * "options": [
   * {"key": "lg", "label": "Rounded (For Pills)"},
   * {"key": "none", "label": "Square (For Underlines)"}
   * ]
   * }]
   */
  tabClassName?: string;

  /**
   * Active Tab Text Styles
   * @type|class
   * @schema [{
   * "key": "Active Text Color",
   * "prefix": "text",
   * "type": "select",
   * "options": [
   * {"key": "slate-900", "label": "Dark"},
   * {"key": "blue-600", "label": "Blue"},
   * {"key": "white", "label": "White"}
   * ]
   * }]
   */
  activeTabClassName?: string;

  /**
   * Animated Indicator Styles
   * @type|class
   * @schema [{
   * "key": "Indicator Theme",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50", "label": "Light Pill"},
   * {"key": "inset-0 bg-slate-900 rounded-lg shadow-sm", "label": "Dark Pill"},
   * {"key": "bottom-0 left-0 right-0 h-[2px] bg-blue-600", "label": "Bottom Underline (Blue)"},
   * {"key": "bottom-0 left-0 right-0 h-[2px] bg-slate-900", "label": "Bottom Underline (Dark)"}
   * ]
   * }]
   */
  indicatorClassName?: string;
}

export default function AnimatedTabs({
  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'settings', label: 'Settings' },
    { id: 'billing', label: 'Billing' },
  ],
  defaultActiveId,
  onChange,
  customAttributes = {},
  // Solid Baseline Defaults (Pill Theme)
  className = 'relative flex items-center bg-slate-100/80 p-1 rounded-xl backdrop-blur-sm w-fit gap-1',
  tabClassName = 'relative flex items-center justify-center font-medium transition-colors duration-200 outline-none px-4 py-2 text-base rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer',
  activeTabClassName = 'text-slate-900',
  indicatorClassName = 'absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50',
  ...props
}: AnimatedTabsProps) {
  // If no default is provided, default to the first tab
  const [activeTab, setActiveTab] = useState(defaultActiveId || tabs[0]?.id);
  const uniqueId = useId();

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  return (
    <div 
      role="tablist"
      className={className}
      {...customAttributes}
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
              ${tabClassName}
              ${isActive ? activeTabClassName : ''}
            `.trim().replace(/\s+/g, ' ')}
          >
            {/* The Text / Icon Content (Raised above the background via z-index) */}
            <span className="relative z-10 flex items-center gap-2 pointer-events-none">
              {tab.icon}
              {tab.label}
            </span>

            {/* The Animated Active Indicator */}
            {isActive && (
              <motion.div
                layoutId={`active-tab-indicator-${uniqueId}`}
                className={indicatorClassName}
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