import React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  
  /** @type|class
   * @schema [{
   * "key": "Columns",
   * "prefix": "grid-cols",
   * "type": "select",
   * "options": [
   * {"key": "1", "label": "1 Column"},
   * {"key": "2", "label": "2 Columns"},
   * {"key": "3", "label": "3 Columns"},
   * {"key": "4", "label": "4 Columns"},
   * {"key": "[repeat(auto-fit,minmax(250px,1fr))]", "label": "Auto-Fit (Cards)"}
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

export default function Grid({
  className = '',
  children,
  ...props
}: GridProps) {
  
  return (
    <div 
      // 'grid w-full' are the non-negotiable base classes. 
      // The engine handles injecting 'grid-cols-3 gap-6 md:grid-cols-4' via className
      className={`grid w-full ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}