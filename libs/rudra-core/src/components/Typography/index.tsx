import React from 'react';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  content: string; /* @translate @textarea */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote' | 'label' | 'strong' | 'em';
  customColor?: string; /* @color */
  
  /** * @type|class
   * @schema [{
   * "key": "Size",
   * "prefix": "text",
   * "type": "select",
   * "options": [
   * {"key": "xs", "label": "Extra Small"},
   * {"key": "sm", "label": "Small"},
   * {"key": "base", "label": "Base"},
   * {"key": "lg", "label": "Large"},
   * {"key": "xl", "label": "Extra Large"},
   * {"key": "2xl", "label": "2XL"},
   * {"key": "3xl", "label": "3XL"},
   * {"key": "4xl", "label": "4XL"},
   * {"key": "5xl", "label": "5XL"},
   * {"key": "6xl", "label": "6XL"},
   * {"key": "7xl", "label": "7XL"},
   * {"key": "8xl", "label": "8XL"},
   * {"key": "9xl", "label": "9XL"}
   * ]
   * },{
   * "key": "Weight",
   * "prefix": "font",
   * "type": "select",
   * "options": [
   * {"key": "thin", "label": "Thin"},
   * {"key": "extralight", "label": "Extra Light"},
   * {"key": "light", "label": "Light"},
   * {"key": "normal", "label": "Normal"},
   * {"key": "medium", "label": "Medium"},
   * {"key": "semibold", "label": "Semi Bold"},
   * {"key": "bold", "label": "Bold"},
   * {"key": "extrabold", "label": "Extra Bold"},
   * {"key": "black", "label": "Black"}
   * ]
   * },{
   * "key": "Align",
   * "prefix": "text",
   * "type": "select",
   * "options": [
   * {"key": "left", "label": "Left"},
   * {"key": "center", "label": "Center"},
   * {"key": "right", "label": "Right"},
   * {"key": "justify", "label": "Justify"}
   * ]
   * }]
   */
  className?: string;
}

export default function Typography({
  content = 'Add your text here...',
  as: Tag = 'p',
  customColor,
  // Set a solid baseline default for initial styling
  className = 'text-base font-normal text-left text-zinc-900 dark:text-zinc-100',
  ...props
}: TypographyProps) {
  
  return (
    <Tag
      className={className}
      style={customColor ? { color: customColor } : undefined}
      {...props}
    >
      {content}
    </Tag>
  );
}