import React from 'react';

export interface BoxProps {
  children?: React.ReactNode;
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>; 
  
  /** * @type|class
   * @schema [{
   * "key": "Display",
   * "type": "select",
   * "options": [
   * {"key": "flex", "label": "Flex"}, 
   * {"key": "block", "label": "Block"},
   * {"key": "grid", "label": "Grid"},
   * {"key": "inline-flex", "label": "Inline Flex"},
   * {"key": "inline-block", "label": "Inline Block"},
   * {"key": "hidden", "label": "Hidden"}
   * ]
   * },{
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
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
}

export const Box: React.FC<BoxProps> = ({
  children,
  customAttributes = {},
  className = '',
  style,
  onClick,
  ...props
}) => {
  // Maintain backward compatibility by defaulting to 'flex' if no display utility is found in className
  const displayClasses = ['flex', 'block', 'grid', 'inline-flex', 'inline-block', 'hidden'];
  const hasDisplayClass = className.split(' ').some(cls => displayClasses.includes(cls));
  
  const finalClassName = hasDisplayClass ? className : `flex ${className}`.trim();
  
  return (
    <div
      className={finalClassName}
      style={style}
      onClick={onClick}
      {...customAttributes}
      {...props}
    >
      {children}
    </div>
  );
};

export default Box;