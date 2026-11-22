import React, { useState } from 'react';
import styles from './styles.module.scss';

type GoogleSignInVariant = 'blush' | 'royal' | 'starlit' | 'golden';
type GoogleSignInSize = 'sm' | 'md' | 'lg';

interface GoogleSignInButtonProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|blush|royal|starlit|golden */
  styleVariant?: GoogleSignInVariant;
  /** @select|sm|md|lg */
  size?: GoogleSignInSize;
  /** @translate */
  label?: string;
  /** @translate */
  loadingLabel?: string;
  /** @translate */
  signedInLabel?: string;
  /** @type|string */
  userName?: string;
  /** @schema {"type":"boolean"} */
  loading?: boolean;
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @schema {"type":"boolean"} */
  fullWidth?: boolean;
  /** @type|function */
  onSignIn?: (meta: { styleVariant: GoogleSignInVariant; themeMode: 'light' | 'dark' }) => void;
  /** @type|function */
  onSignOut?: () => void;
}

function GoogleGMark() {
  return (
    <span className={styles.gBadge} aria-hidden="true">
      <svg className={styles.gSvg} viewBox="0 0 24 24" width="18" height="18">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.97 11.97 0 0 0 0 12c0 1.93.46 3.75 1.29 5.38l3.98-3.09z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
        />
      </svg>
    </span>
  );
}

function GoogleSignInButton({
  themeMode = 'light',
  styleVariant = 'blush',
  size = 'md',
  label = 'Continue with Google',
  loadingLabel = 'Signing in...',
  signedInLabel = 'Signed in',
  userName = '',
  loading = false,
  disabled = false,
  fullWidth = false,
  onSignIn,
  onSignOut,
}: GoogleSignInButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [localSignedIn, setLocalSignedIn] = useState(false);

  const isBusy = Boolean(loading || internalLoading);
  const isSignedIn = Boolean(userName) || localSignedIn;

  const handleClick = () => {
    if (disabled || isBusy) return;
    if (isSignedIn) {
      setLocalSignedIn(false);
      onSignOut?.();
      return;
    }
    if (!onSignIn) {
      setInternalLoading(true);
      window.setTimeout(() => {
        setInternalLoading(false);
        setLocalSignedIn(true);
      }, 650);
      return;
    }
    onSignIn({ styleVariant, themeMode });
  };

  const displayText = isBusy
    ? loadingLabel
    : isSignedIn
    ? userName
      ? `${signedInLabel} as ${userName}`
      : signedInLabel
    : label;

  return (
    <div className={`${styles.wrap} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <button
        type="button"
        disabled={disabled || isBusy}
        aria-busy={isBusy || undefined}
        onClick={handleClick}
        className={[
          styles.btn,
          styles[`var_${styleVariant}`] || styles.var_blush,
          styles[`sz_${size}`] || styles.sz_md,
          fullWidth ? styles.fullWidth : '',
          isSignedIn ? styles.signedIn : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <GoogleGMark />
        <span className={styles.label}>{displayText}</span>
        {!isBusy && !isSignedIn && (
          <span className={styles.sparkle} aria-hidden="true">
            ✨
          </span>
        )}
        {isSignedIn && (
          <span className={styles.checkBadge} aria-hidden="true">
            ✓
          </span>
        )}
      </button>
    </div>
  );
}

export default GoogleSignInButton;
