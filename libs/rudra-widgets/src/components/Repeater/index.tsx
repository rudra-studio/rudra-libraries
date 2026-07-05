import React from 'react';

// The interface explicitly defines the render function signature and right-side annotations
export interface RepeaterProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: any[];                   /* @optional */
  layout?: 'grid' | 'stack' | 'flex'; /* @optional @select|grid|stack|flex */
  children?: React.ReactNode | ((context: { item: any; index: number }) => React.ReactNode);  /* @nodeFunction */

  /** 
   * @type|class
   * @schema [{
   * "key": "Grid Columns",
   * "prefix": "grid-cols",
   * "type": "select",
   * "options": [
   * {"key": "1", "label": "1 Column"},
   * {"key": "2", "label": "2 Columns"},
   * {"key": "3", "label": "3 Columns"},
   * {"key": "4", "label": "4 Columns"},
   * {"key": "6", "label": "6 Columns"}
   * ]
   * },{
   * "key": "Flex Direction",
   * "prefix": "flex",
   * "type": "select",
   * "options": [
   * {"key": "row", "label": "Row"}, 
   * {"key": "col", "label": "Column"}
   * ]
   * },{
   * "key": "Wrap Content",
   * "prefix": "flex",
   * "type": "select",
   * "options": [
   * {"key": "wrap", "label": "Wrap"}, 
   * {"key": "nowrap", "label": "No Wrap"}
   * ]
   * },{
   * "key": "Justify (Main Axis)",
   * "prefix": "justify",
   * "type": "select",
   * "options": [
   * {"key": "start", "label": "Start"},
   * {"key": "center", "label": "Center"},
   * {"key": "end", "label": "End"},
   * {"key": "between", "label": "Space Between"}
   * ]
   * },{
   * "key": "Align (Cross Axis)",
   * "prefix": "items",
   * "type": "select",
   * "options": [
   * {"key": "start", "label": "Start"},
   * {"key": "center", "label": "Center"},
   * {"key": "end", "label": "End"},
   * {"key": "stretch", "label": "Stretch"}
   * ]
   * },{
   * "key": "Gap",
   * "prefix": "gap",
   * "type": "select",
   * "options": [
   * {"key": "0", "label": "None (0px)"},
   * {"key": "2", "label": "Small (8px)"},
   * {"key": "4", "label": "Medium (16px)"},
   * {"key": "6", "label": "Large (24px)"},
   * {"key": "8", "label": "Extra Large (32px)"}
   * ]
   * }]
   */
  className?: string;
}

export default function Repeater({
  items = [],
  layout = 'grid',
  className = '',
  children,
  ...props
}: RepeaterProps) {
  
  const safeItems = Array.isArray(items) ? items : [];

  // Dynamically resolve only the base layout class
  let containerClass = '';
  if (layout === 'grid') {
    containerClass = 'grid w-full';
  } else if (layout === 'flex') {
    containerClass = 'flex w-full';
  } else {
    containerClass = 'flex flex-col w-full'; // Default Stack
  }

  // Design-time safety: If no items are bound yet, show a placeholder in the builder canvas
  if (safeItems.length === 0) {
    return (
      <div className={`w-full p-8 border-2 border-dashed border-purple-200 bg-purple-50 rounded-lg flex flex-col items-center justify-center text-purple-600 ${className}`.trim()}>
        <span className="text-sm font-medium mb-2 opacity-70">Repeater (No Data Bound)</span>
        <div className="mt-4 w-full p-4 border border-dashed border-purple-300 rounded bg-white">
            {/* Execute dummy payload so the builder canvas doesn't crash when elements are dropped inside */}
           {typeof children === 'function' ? children({ item: null, index: 0 }) : children}
        </div>
      </div>
    );
  }

  // Runtime execution: Pure functional injection, zero Context API overhead
  return (
    <div className={`${containerClass} ${className}`.trim()} {...props}>
      {safeItems.map((item, index) => (
        <React.Fragment key={item?.id || index}>
           {typeof children === 'function' ? children({ item, index }) : children}
        </React.Fragment>
      ))}
    </div>
  );
}