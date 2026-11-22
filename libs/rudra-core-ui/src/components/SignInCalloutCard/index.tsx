import React, { useState } from 'react';
import styles from './styles.module.scss';

interface SignInCalloutCardProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  description?: string;
  /** @translate */
  signInLabel?: string;
  /** @translate */
  signedInPrefix?: string;
  /** @type|string */
  userName?: string;
  /** @type|string */
  userEmail?: string;
  /** @type|function */
  onSignIn?: () => void;
  /** @type|function */
  onSignOut?: () => void;
}

function SignInCalloutCard({
  themeMode = 'light',
  title = 'Save Drafts & Manage Invitations',
  description = 'Sign in with Google to keep your pages organized, customize celebration templates, and view guest RSVPs.',
  signInLabel = 'Continue with Google',
  signedInPrefix = 'Signed in as',
  userName = '',
  userEmail = '',
  onSignIn,
  onSignOut,
}: SignInCalloutCardProps) {
  const [localSignedIn, setLocalSignedIn] = useState(false);
  const isSignedIn = Boolean(userName || userEmail) || localSignedIn;
  const displayUser = userName || userEmail || 'Account';

  const handleClick = () => {
    if (isSignedIn) {
      setLocalSignedIn(false);
      onSignOut?.();
      return;
    }
    if (!onSignIn) {
      setLocalSignedIn(true);
      return;
    }
    onSignIn();
  };

  return (
    <section className={`${styles.card} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.copy}>
        <span className={styles.status}>{isSignedIn ? '● Authenticated' : '○ Sign In'}</span>
        <h3 className={styles.title}>{isSignedIn ? `${signedInPrefix} ${displayUser}` : title}</h3>
        <p className={styles.desc}>{description}</p>
      </div>

      <button type="button" className={styles.btn} onClick={handleClick}>
        <span>{isSignedIn ? `Sign out (${displayUser})` : signInLabel}</span>
      </button>
    </section>
  );
}

export default SignInCalloutCard;
