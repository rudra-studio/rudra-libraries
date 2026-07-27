import React from 'react';

export interface SeparatorProps {
  text?: string; /* @type|string|@translate */
  
  /**
   * @class|[
   *   {"key": "Spacing", "prefix": "my", "type": "select", "options": [{"key": "0", "label": "None"}, {"key": "4", "label": "Small"}, {"key": "6", "label": "Medium"}, {"key": "8", "label": "Large"}]},
   *   {"key": "Line Style", "prefix": "border", "type": "select", "options": [{"key": "solid", "label": "Solid"}, {"key": "dashed", "label": "Dashed"}, {"key": "dotted", "label": "Dotted"}]},
   *   {"key": "Alignment", "prefix": "text", "type": "select", "options": [{"key": "left", "label": "Left"}, {"key": "center", "label": "Center"}, {"key": "right", "label": "Right"}]}
   * ]
   */
  className?: string;
}

export default function Separator({
  text,
  className = 'my-6 border-solid text-center'
}: SeparatorProps) { /* @metadata A semantic visual divider utilizing fieldset. Handles lines and masked text seamlessly without background hiding via class injection. */

  // 1. Simple Line Variant (No Text)
  if (!text) {
    return <div className={`w-full border-0 border-t border-gray-200 dark:border-gray-800 ${className}`} />;
  }

  // 2. Text Variant (We map the injected text alignment to the legend's margin natively)
  let legendMargin = "mx-auto"; // Defaults to center
  if (className.includes('text-left')) legendMargin = "ml-4";
  else if (className.includes('text-right')) legendMargin = "ml-auto mr-4";

  return (
    <fieldset className={`w-full border-0 border-t border-gray-200 dark:border-gray-800 ${className}`}>
      <legend className={`px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest ${legendMargin}`}>
        {text}
      </legend>
    </fieldset>
  );
}