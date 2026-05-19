import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './styles.module.scss';

export interface RecordItem {
  id: string | number;
  title: string;
  description?: string;
  avatar?: string;
}

export interface RecordListProps {
  items: RecordItem[];
  onDelete?: (id: string | number) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  emptySlot?: React.ReactNode;
}

export default function RecordList({
  items,
  onDelete,
  children,
  className = '',
  style,
  emptySlot
}: RecordListProps) {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      <AnimatePresence mode="popLayout">
        {items.length > 0 ? (
          items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                x: 100, 
                scale: 0.9, 
                transition: { duration: 0.2 } 
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 1
              }}
              className={styles.recordRow}
            >
              <div className={styles.content}>
                {item.avatar ? (
                  <div className={styles.avatar}>
                    <img src={item.avatar} alt={item.title} />
                  </div>
                ) : (
                   <div className={styles.avatarPlaceholder}>
                      {item.title.charAt(0).toUpperCase()}
                   </div>
                )}
                <div className={styles.textContainer}>
                  <h4 className={styles.title}>{item.title}</h4>
                  {item.description && <p className={styles.description}>{item.description}</p>}
                </div>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete?.(item.id)}
                aria-label="Delete record"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </motion.div>
          ))
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.emptyState}
          >
            {emptySlot || 'No records to display'}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
