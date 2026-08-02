import React from 'react'; import styles from './styles.module.scss';
export interface FormSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode;
  variant?: 'plain' | 'outlined' | 'filled'; density?: 'compact' | 'comfortable'; collapsible?: boolean; defaultCollapsed?: boolean;
}
export default function FormSection({ title, description, actions, children, variant = 'plain', density = 'comfortable', collapsible = false, defaultCollapsed = false, className, ...rest }: FormSectionProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed); const headingId = React.useId();
  return <section {...rest} className={[styles.section, styles[variant], styles[density], className ?? ''].filter(Boolean).join(' ')} aria-labelledby={title ? headingId : undefined}>
    {(title || description || actions) && <header className={styles.header}><div className={styles.heading}>{title && <h2 id={headingId}>{title}</h2>}{description && <div className={styles.description}>{description}</div>}</div><div className={styles.actions}>{actions}{collapsible && <button type="button" aria-expanded={!collapsed} aria-label={collapsed ? 'Expand section' : 'Collapse section'} onClick={() => setCollapsed(current => !current)}>{collapsed ? '＋' : '−'}</button>}</div></header>}
    {!collapsed && <div className={styles.content}>{children}</div>}
  </section>
}
