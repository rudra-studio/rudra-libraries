import React from 'react';
import styles from './styles.module.scss';

export interface Employee {
  id: string | number;
  name: string;
  position: string;
  department: string;
  email: string;
  status?: 'Active' | 'Inactive';
}

export interface EmployeeTableProps {
  employees: Employee[];
  onRowClick?: (employee: Employee) => void;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  emptyStateSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function EmployeeTable({
  employees = [],
  onRowClick,
  headerSlot,
  footerSlot,
  emptyStateSlot,
  children,
  className = '',
  style
}: EmployeeTableProps) {
  return (
    <div className={`${styles.tableContainer} ${className}`} style={style}>
      {headerSlot && <div className={styles.headerSlot}>{headerSlot}</div>}
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr 
                  key={employee.id} 
                  onClick={() => onRowClick?.(employee)}
                  className={onRowClick ? styles.clickableRow : ''}
                >
                  <td>{employee.id}</td>
                  <td className={styles.boldText}>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{employee.email}</td>
                  <td>
                    <span className={`${styles.badge} ${employee.status === 'Inactive' ? styles.inactive : styles.active}`}>
                      {employee.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.emptyCell}>
                  {emptyStateSlot || 'No employee records found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {children}
      {footerSlot && <div className={styles.footerSlot}>{footerSlot}</div>}
    </div>
  );
}
