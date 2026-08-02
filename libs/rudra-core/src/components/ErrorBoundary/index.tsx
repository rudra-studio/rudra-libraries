import React from 'react';
import styles from './styles.module.scss';

export interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackTitle?: string;
  showDetails?: boolean;
  resetKey?: string | number;
  className?: string;
  onError?: (error: Error, info: React.ErrorInfo) => void /* @type|function|return:void|args:error,info */;
  onReset?: () => void /* @type|function|return:void */;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (
      this.state.error &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ error: null });
    }
  }

  private reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    const {
      children,
      fallback,
      fallbackTitle = 'Something went wrong',
      showDetails = false,
      className = '',
    } = this.props;
    const { error } = this.state;

    if (!error) return children;

    if (fallback) return fallback;

    return (
      <div
        className={[styles.root, className].filter(Boolean).join(' ')}
        role="alert"
        aria-live="assertive"
      >
        <div className={styles.marker} aria-hidden="true">!</div>
        <div className={styles.content}>
          <h2 className={styles.title}>{fallbackTitle}</h2>
          <p className={styles.message}>
            This section could not be displayed. You can retry without reloading the entire application.
          </p>
          {showDetails && (
            <details className={styles.details}>
              <summary>Error details</summary>
              <pre>{error.message}</pre>
            </details>
          )}
          <button type="button" className={styles.retry} onClick={this.reset}>
            Try again
          </button>
        </div>
      </div>
    );
  }
}
