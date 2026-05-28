import React, { createContext } from 'react';

// We export this context so child components (like a Heading) 
// can read the current loop item data using a custom hook in the builder!
export const RepeaterContext = createContext<any>(null);

export interface RepeaterProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: any[]; // The data array. Parsed as type: 'array' in Go.
  layout?: 'grid' | 'stack'; /* @select|grid|stack */
  columns?: '1' | '2' | '3' | '4'; /* @select|1|2|3|4 */ // Used if layout is grid
  gap?: 'sm' | 'md' | 'lg'; /* @select|sm|md|lg */
  children?: React.ReactNode;
}

export function Repeater({
  items = [],
  layout = 'grid',
  columns = '3',
  gap = 'md',
  className = '',
  children,
  ...props
}: RepeaterProps) {
  
  // Safe fallback if the binding fails or isn't an array
  const safeItems = Array.isArray(items) ? items : [];

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const gridCols: Record<string, string> = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
  };

  const containerClass = layout === 'grid' 
    ? `grid ${gridCols[columns]} ${gapClasses[gap]}`
    : `flex flex-col w-full ${gapClasses[gap]}`;

  // If no items are bound yet, show a placeholder in the builder
  if (safeItems.length === 0) {
    return (
      <div className={`w-full p-8 border-2 border-dashed border-purple-200 bg-purple-50 rounded-lg flex flex-col items-center justify-center text-purple-600 ${className}`}>
        <span className="font-semibold text-sm">Empty Repeater</span>
        <span className="text-xs mt-1">Bind an array to the 'items' prop to see content</span>
        <div className="mt-4 w-full p-4 border border-dashed border-purple-300 rounded bg-white">
           {children || <span className="text-xs text-zinc-400">Drag template component here</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClass} ${className}`} {...props}>
      {safeItems.map((item, index) => (
        // We wrap EACH iteration in a context provider.
        // This allows your builder to bind child component props to `repeaterContext.item.price` etc.
        <RepeaterContext.Provider key={item.id || index} value={{ item, index }}>
          {/* React requires keys, but children from the builder might just be a standard element. 
              We wrap it in a fragment with a key. */}
          <React.Fragment key={item.id || index}>
             {children}
          </React.Fragment>
        </RepeaterContext.Provider>
      ))}
    </div>
  );
}