import React from 'react';
import styles from './styles.module.scss';

export type StatTrend = 'up' | 'down' | 'neutral';
export type StatVariant = 'plain' | 'bordered' | 'raised';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  value?: React.ReactNode;
  helperText?: React.ReactNode;
  icon?: React.ReactNode;
  visualization?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  trend?: StatTrend /* @select|up|down|neutral */;
  variant?: StatVariant /* @select|plain|bordered|raised */;
  loading?: boolean;
}

export default function Stat({
  label = 'Monthly revenue',
  value = '$24,800',
  helperText,
  icon,
  visualization,
  change,
  changeLabel = 'from previous period',
  trend,
  variant = 'bordered',
  loading = false,
  className = '',
  ...props
}: StatProps) {
  const resolvedTrend = trend || (
    typeof change === 'number'
      ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral')
      : 'neutral'
  );
  const formattedChange = typeof change === 'number'
    ? (change > 0 ? '+' : '') + change.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '%'
    : null;

  return (
    <div
      className={[
        styles.root,
        styles['variant_' + variant],
        loading ? styles.loading : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-busy={loading || undefined}
      {...props}
    >
      <div className={styles.header}>
        <div className={styles.label}>{label}</div>
        {icon && <div className={styles.icon} aria-hidden="true">{icon}</div>}
      </div>

      <div className={styles.main}>
        <div className={styles.value}>{loading ? <span className={styles.valueSkeleton} /> : value}</div>
        {visualization && <div className={styles.visualization}>{visualization}</div>}
      </div>

      {(formattedChange || helperText) && (
        <div className={styles.footer}>
          {formattedChange && (
            <span
              className={[styles.change, styles['trend_' + resolvedTrend]].join(' ')}
              aria-label={formattedChange + ' ' + changeLabel}
            >
              <span aria-hidden="true">
                {resolvedTrend === 'up' ? '↑' : resolvedTrend === 'down' ? '↓' : '—'}
              </span>
              {formattedChange}
            </span>
          )}
          {helperText && <span className={styles.helper}>{helperText}</span>}
          {!helperText && formattedChange && <span className={styles.helper}>{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
