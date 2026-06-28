import React from 'react';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  
  // The Custom Attributes Dictionary
  // We use additionalProperties to tell the schema it's a dynamic key-value object
  customAttributes?: Record<string, string>; /* @complex|{"type":"object"} */
  
  /** * @type|class
   * @schema [{
   * "key": "Direction",
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

export const Box: React.FC<BoxProps> = ({
  children,
  customAttributes = {},
  className = '',
  ...props
}) => {
  
  return (
    <div
      className={`flex ${className}`.trim()}
      {...customAttributes}
      {...props}
    >
      {children}
    </div>
  );
};

export default Box;