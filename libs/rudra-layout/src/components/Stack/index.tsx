import React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  /** *@type|class
   * @schema [{
   * "key": "Direction",
   * "prefix": "flex",
   * "type": "select",
   * "options": [
   * {"key": "row", "label": "Row"}, 
   * {"key": "col", "label": "Column"}
   * ]
   * },{
   * "key": "Align Items (Cross Axis)",
   * "prefix": "items",
   * "type": "select",
   * "options": [
   * {"key": "start", "label": "Start"},
   * {"key": "center", "label": "Center"},
   * {"key": "end", "label": "End"},
   * {"key": "stretch", "label": "Stretch"}
   * ]
   * },{
   * "key": "Justify Content (Main Axis)",
   * "prefix": "justify",
   * "type": "select",
   * "options": [
   * {"key": "start", "label": "Start"},
   * {"key": "center", "label": "Center"},
   * {"key": "end", "label": "End"},
   * {"key": "between", "label": "Space Between"},
   * {"key": "around", "label": "Space Around"}
   * ]
   * },{
   * "key": "Gap",
   * "prefix": "gap",
   * "type": "select",
   * "options": [
   * {"key": "0", "label": "None (0px)"},
   * {"key": "2", "label": "Small (8px)"},
   * {"key": "4", "label": "Medium (16px)"},
   * {"key": "8", "label": "Large (32px)"},
   * {"key": "12", "label": "Extra Large (48px)"}
   * ]
   * },{
   * "key": "Wrap Content",
   * "prefix": "flex",
   * "type": "select",
   * "options": [
   * {"key": "wrap", "label": "Wrap"}, 
   * {"key": "nowrap", "label": "No Wrap"}
   * ]
   * }]
   */
  className?: string;
}

export default function Stack({
  className = '',
  children,
  ...props
}: StackProps) {
  
  return (
    <div 
      // 'flex w-full' is the baseline. 
      // The engine handles injecting 'flex-col items-stretch justify-start gap-4 flex-nowrap' etc. via className
      className={`flex w-full ${className}`.trim()}
      {...props}
    >
      {/* Builder Dropzone Placeholder */}
      {children}
    </div>
  );
}