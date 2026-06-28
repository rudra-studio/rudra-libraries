import React from 'react';

export interface RepeaterProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: any[]; /* @optional */
  children?: React.ReactNode | ((context: { item: any; index: number }) => React.ReactNode); /* @nodeFunction */
  
  /** * @type|class
   * @schema [{
   * "key": "Layout",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "grid", "label": "Grid"},
   * {"key": "flex flex-col", "label": "Stack (Vertical)"}
   * ]
   * },{
   * "key": "Columns (Grid Only)",
   * "prefix": "grid-cols",
   * "type": "select",
   * "options": [
   * {"key": "1", "label": "1 Column"},
   * {"key": "2", "label": "2 Columns"},
   * {"key": "3", "label": "3 Columns"},
   * {"key": "4", "label": "4 Columns"},
   * {"key": "5", "label": "5 Columns"},
   * {"key": "6", "label": "6 Columns"},
   * {"key": "[repeat(auto-fit,minmax(250px,1fr))]", "label": "Auto-Fit Cards"}
   * ]
   * },{
   * "key": "Gap",
   * "prefix": "gap",
   * "type": "select",
   * "options": [
   * {"key": "0", "label": "None (0px)"},
   * {"key": "4", "label": "Small (16px)"},
   * {"key": "6", "label": "Medium (24px)"},
   * {"key": "8", "label": "Large (32px)"},
   * {"key": "12", "label": "Extra Large (48px)"}
   * ]
   * }]
   */
  className?: string;
}

export default function Repeater({
  items = [],
  className = '',
  children,
  ...props
}: RepeaterProps) {
  
  const safeItems = Array.isArray(items) ? items : [];

  // Design-time safety: If no items are bound yet, show a placeholder in the builder canvas
  if (safeItems.length === 0) {
    return (
      <div className="w-full p-8 border-2 border-dashed border-purple-200 bg-purple-50 rounded-lg flex flex-col items-center justify-center text-purple-600">
        <span className="text-sm font-medium mb-2 opacity-70">Repeater (No Data Bound)</span>
        
        {/* We apply the user's className HERE so the dummy elements preview the exact grid/stack layout */}
        <div className={`mt-4 w-full p-4 border border-dashed border-purple-300 rounded bg-white ${className}`}>
           {typeof children === 'function' ? children({ item: null, index: 0 }) : children}
        </div>
      </div>
    );
  }

  // Runtime execution: Pure functional injection, zero Context API overhead
  return (
    <div className={`w-full ${className}`.trim()} {...props}>
      {safeItems.map((item, index) => (
        <React.Fragment key={item?.id || index}>
           {typeof children === 'function' ? children({ item, index }) : children}
        </React.Fragment>
      ))}
    </div>
  );
}