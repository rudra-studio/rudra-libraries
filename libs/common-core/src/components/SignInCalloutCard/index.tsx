import React, { useState } from "react";
import styles from "./styles.module.scss";

export type SignInCalloutCardThemeMode = "light" | "dark";

export interface SignInCalloutCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "title"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SignInCalloutCardThemeMode;

  /**
   * Callout card heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Supporting description copy.
   *
   * @translate
   */
  description?: string;

  /**
   * Sign-in button label.
   *
   * @translate
   */
  signInLabel?: string;

  /**
   * Prefix shown before signed-in account name.
   *
   * @translate
   */
  signedInPrefix?: string;

  /**
   * Optional signed-in user name.
   */
  userName?: string;

  /**
   * Optional signed-in user email.
   */
  userEmail?: string;

  /**
   * Callback when sign-in button is clicked.
   */
  onSignIn?: () => void;

  /**
   * Callback when sign-out button is clicked.
   */
  onSignOut?: () => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function SignInCalloutCard({
  themeMode = "light",
  title = "Save Drafts & Sync Your Workspace",
  description = "Sign in to keep your reusable libraries, modules, and application snapshots synced across sessions.",
  signInLabel = "Continue with Google",
  signedInPrefix = "Signed in as",
  userName = "",
  userEmail = "",
  onSignIn,
  onSignOut,
  className = "",
  ...props
}: SignInCalloutCardProps) {
  const [localSignedIn, setLocalSignedIn] = useState(false);
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const isSignedIn = Boolean(userName || userEmail) || localSignedIn;
  const displayUser = userName || userEmail || "Workspace Member";

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
    <section
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.copy}>
        <span className={styles.status}>
          {isSignedIn ? "● Authenticated" : "○ Account"}
        </span>
        <h3 className={styles.title}>
          {isSignedIn ? `${signedInPrefix} ${displayUser}` : title}
        </h3>
        <p className={styles.desc}>{description}</p>
      </div>

      <button type="button" className={styles.btn} onClick={handleClick}>
        <span>{isSignedIn ? `Sign out (${displayUser})` : signInLabel}</span>
      </button>
    </section>
  );
}
