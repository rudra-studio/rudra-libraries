import React from 'react';

// The interface explicitly defines the render function signature and right-side annotations
export interface RepeaterProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: any[];                   /* @optional */
  layout?: 'grid' | 'stack';       /* @optional @select|grid|stack */
  columns?: number; /* @optional */
  gap?: 'sm' | 'md' | 'lg';        /* @optional @select|sm|md|lg */
  children?: React.ReactNode | ((context: { item: any; index: number }) => React.ReactNode);  /* @nodeFunction */
}

export default function Repeater({
  items = [],
  layout = 'grid',
  columns = '4',
  gap = 'md',
  className = '',
  children,
  ...props
}: RepeaterProps) {
  
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

  // Design-time safety: If no items are bound yet, show a placeholder in the builder canvas
  if (safeItems.length === 0) {
    return (
      <div className={`w-full p-8 border-2 border-dashed border-purple-200 bg-purple-50 rounded-lg flex flex-col items-center justify-center text-purple-600 ${className}`}>
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
    <div className={`${containerClass} ${className}`} {...props}>
      {safeItems.map((item, index) => (
        <React.Fragment key={item?.id || index}>
           {typeof children === 'function' ? children({ item, index }) : children}
        </React.Fragment>
      ))}
    </div>
  );
}