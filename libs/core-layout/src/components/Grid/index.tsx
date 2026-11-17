import React from 'react';
import './styles.module.scss';

interface GridProps {
  children: React.ReactNode;
  rows?: number;
  columns?: number;
  gap?: number;
  templateRows?: string;
  templateColumns?: string;
  templateAreas?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  rows = 1,
  columns = 1,
  gap = 2,
  templateRows = '1fr',
  templateColumns = '1fr',
  templateAreas,
}) => {
  return (
    <div
      className='grid-container'
      style={{
        gridTemplateRows: templateRows,
        gridTemplateColumns: templateColumns,
        gridTemplateAreas: templateAreas,
        gap: `${gap}rem`,
      }}
    >
      {children}
    </div>
  );
};

export default Grid;