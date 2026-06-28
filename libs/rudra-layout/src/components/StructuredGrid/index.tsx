import React, { useMemo } from 'react';

export interface ComplexGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The data defining the names of the slots and their dropped content */
  gridData?: { name: string; node: React.ReactNode }[]; /* @complex|{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"node":{"type":"node"}}}} */
  
  // Layout Templates (Kept as props because they are dynamic CSS values)
  templateColumns?: string; 
  templateRows?: string; 
  templateAreas?: string; 
  minHeight?: string;
  
  /** * @type|class
   * @schema [{
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

export const ComplexGrid: React.FC<ComplexGridProps> = ({
  gridData = [],
  templateColumns = "1fr 1fr",
  templateRows = "auto auto",
  templateAreas = '"area1 area2" "area3 area4"',
  minHeight = '300px',
  className = '',
  ...props
}) => {

  // 1. Extract the unique area names requested in the CSS template string
  const activeAreas = useMemo(() => {
    if (!templateAreas) return [];
    // Remove quotes and split by whitespace
    const rawNames = templateAreas.replace(/"|'/g, '').split(/\s+/);
    // Remove empty strings and dots (used for empty grid cells in CSS)
    const filteredNames = rawNames.filter(name => name.trim() !== '' && name.trim() !== '.');
    return Array.from(new Set(filteredNames));
  }, [templateAreas]);

  // 2. Helper to get the React node for a specific area name
  const renderSlot = (areaName: string) => {
    const matchedDef = gridData?.find(item => item && item.name === areaName);
    return matchedDef?.node || null;
  };

  // 3. Assemble the inline styles
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: templateColumns,
    gridTemplateRows: templateRows,
    gridTemplateAreas: templateAreas,
    minHeight,
    ...props.style
  };

  return (
    <div 
      // The builder engine injects the gap classes and user custom classes via className
      className={`w-full grid ${className}`.trim()}
      style={gridStyles}
      {...props}
    >
      {activeAreas.map((areaName) => {
        const slotContent = renderSlot(areaName);
        const isEmpty = !slotContent;

        return (
          <div 
            key={areaName}
            style={{ gridArea: areaName }}
            className={`
              relative min-h-[50px] transition-colors
              ${isEmpty ? 'border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 hover:border-blue-400' : ''}
            `}
          >
            {isEmpty && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                  {areaName}
                </span>
              </div>
            )}
            {slotContent}
          </div>
        );
      })}
    </div>
  );
};

export default ComplexGrid;