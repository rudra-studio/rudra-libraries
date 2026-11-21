import React from 'react';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import styles from './styles.module.scss';

export interface TableRowData {
  name: string;
  role: string;
  status: string;
}

export interface TableProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|json */
  rows?: TableRowData[];
}

const DEFAULT_ROWS: TableRowData[] = [
  { name: 'Synechron', role: 'Senior Associate', status: 'Active' },
  { name: 'Wipro', role: 'Software Engineer', status: 'Completed' },
];

export function Table({
  themeMode = 'dark',
  rows = DEFAULT_ROWS,
}: TableProps) {
  const list = Array.isArray(rows) && rows.length > 0 ? rows : DEFAULT_ROWS;

  return (
    <div data-theme={themeMode} className={styles.root}>
      <TableContainer component={Paper} variant="outlined">
        <MuiTable size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((r, i) => (
              <TableRow key={`${r.name}-${i}`}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.role}</TableCell>
                <TableCell>{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </div>
  );
}
export default Table;
