import React, { useState } from 'react';
import type OccasionTemplateItem from '../../utils/OccasionTemplateItem';
import styles from './styles.module.scss';

interface SmileyyfyLandingShowcaseProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  badgeText?: string;
  /** @translate */
  heroTitle?: string;
  /** @translate */
  heroDescription?: string;
  /** @translate */
  primaryCtaLabel?: string;
  /** @translate */
  secondaryCtaLabel?: string;
  /** @translate */
  aboutTitle?: string;
  /** @translate */
  aboutDescription?: string;
  /** @type|string */
  signedInUserName?: string;
  /** @type|string */
  signedInUserEmail?: string;
  /** @type|function */
  onStartBuilding?: (preset: string) => void;
  /** @type|function */
  onExploreTemplates?: () => void;
  /** @type|function */
  onSignIn?: (meta: { styleVariant: 'blush' | 'royal' | 'starlit' | 'golden'; themeMode: 'light' | 'dark' }) => void;
  /** @type|function */
  onSignOut?: () => void;
}

const HIGHLIGHTS = [
  {
    id: 'invites',
    icon: '💌',
    title: 'Weddings, Birthdays & Events',
    detail: 'Craft warm digital invitations with live countdowns, venue details, themes, and optional guest RSVP tracking.',
    preset: 'invitation',
  },
  {
    id: 'proposals',
    icon: '💘',
    title: 'Playful Love Proposals',
    detail: 'Share custom love letters, Polaroid photo memories, floating hearts, and interactive runaway buttons.',
    preset: 'proposal',
  },
  {
    id: 'i18n-media',
    icon: '🌐',
    title: 'Multilingual & Looping Music',
    detail: 'Switch between languages effortlessly and pair pages with looping background songs or story animations.',
    preset: 'anniversary',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pick an Occasion or Preset',
    copy: 'Start from a wedding invite, love proposal, birthday bash, anniversary timeline, or baby shower layout.',
  },
  {
    step: '02',
    title: 'Customize Text, Photos & Motion',
    copy: 'Add personal notes, Polaroid memories, floating hearts or confetti, sprite scenes, and music in minutes.',
  },
  {
    step: '03',
    title: 'Share & Track Optional RSVPs',
    copy: 'Publish a link for guests or partners and toggle RSVP guest tracking whenever you want responses.',
  },
];

const FEATURED_TEMPLATES: OccasionTemplateItem[] = [
  {
    id: 'wedding-suite',
    title: 'Royal Wedding Invite & RSVP',
    category: 'Weddings & Events',
    emoji: '💍',
    description: 'Elegant wedding invitation card with live countdown, venue details, and optional guest RSVP tracker.',
    tags: ['Optional RSVP', 'Countdown', 'Share Link'],
    routeHint: '/invites',
  },
  {
    id: 'love-proposal',
    title: 'Playful Love Proposal Website',
    category: 'Romance',
    emoji: '💘',
    description: 'Custom love letter, Polaroid photo gallery, floating hearts, and the viral flying runaway “No” button.',
    tags: ['Flying Button', 'Floating Hearts', 'Photo Polaroids'],
    routeHint: '/proposal',
  },
  {
    id: 'birthday-bash',
    title: 'Birthday Surprise Countdown',
    category: 'Milestones',
    emoji: '🎂',
    description: 'Confetti-filled birthday celebration page with custom wishes, party schedule, and optional headcount.',
    tags: ['Confetti Burst', 'Custom Theme', 'RSVP'],
    routeHint: '/invites',
  },
];

function GoogleBadgeIcon() {
  return (
    <span className={styles.gIconWrap} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18">
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

function SmileyyfyLandingShowcase({
  themeMode = 'light',
  badgeText = '✨ Interactive Invitations, Love Proposals & Celebration Pages',
  heroTitle = 'Turn Every Special Moment Into a Living Story',
  heroDescription = 'Smileyyfy helps you create expressive wedding & event invitations with optional RSVP tracking, romantic love proposals with floating hearts & playful buttons, and joyful celebration pages—without writing code.',
  primaryCtaLabel = 'Start Creating Free',
  secondaryCtaLabel = 'Explore Templates',
  aboutTitle = 'What Smileyyfy Is About',
  aboutDescription = 'Traditional paper invites and static links feel flat when a moment deserves emotion. Smileyyfy combines warm visual storytelling, gentle motion, multilingual text support, and optional RSVP management so every invite or proposal feels personal.',
  signedInUserName = '',
  signedInUserEmail = '',
  onStartBuilding,
  onExploreTemplates,
  onSignIn,
  onSignOut,
}: SmileyyfyLandingShowcaseProps) {
  const [signingIn, setSigningIn] = useState(false);
  const [localUser, setLocalUser] = useState(false);

  const isSignedIn = Boolean(signedInUserName || signedInUserEmail) || localUser;
  const displayName = signedInUserName || signedInUserEmail || 'Guest';

  const handleAuthClick = () => {
    if (signingIn) return;
    if (isSignedIn) {
      setLocalUser(false);
      onSignOut?.();
      return;
    }
    if (!onSignIn) {
      setSigningIn(true);
      window.setTimeout(() => {
        setSigningIn(false);
        setLocalUser(true);
      }, 600);
      return;
    }
    onSignIn({ styleVariant: 'blush', themeMode });
  };

  return (
    <div className={`${styles.page} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <section className={styles.heroBanner} aria-labelledby="smileyyfy-hero-heading">
        <div className={styles.ambientGlow} aria-hidden="true">
          <span className={styles.floatGlyph} style={{ left: '8%', animationDelay: '0s' }}>💖</span>
          <span className={styles.floatGlyph} style={{ left: '26%', animationDelay: '1.1s' }}>✨</span>
          <span className={styles.floatGlyph} style={{ left: '72%', animationDelay: '0.6s' }}>🌸</span>
          <span className={styles.floatGlyph} style={{ left: '88%', animationDelay: '1.7s' }}>💍</span>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{badgeText}</span>
            <h1 id="smileyyfy-hero-heading" className={styles.heroHeading}>
              {heroTitle}
            </h1>
            <p className={styles.heroLead}>{heroDescription}</p>

            <div className={styles.heroActions}>
              <button
                type="button"
                className={styles.primaryCta}
                onClick={() => onStartBuilding?.('invitation')}
              >
                {primaryCtaLabel} →
              </button>
              <button
                type="button"
                className={styles.secondaryCta}
                onClick={() => onExploreTemplates?.()}
              >
                {secondaryCtaLabel}
              </button>
            </div>
          </div>

          <aside className={styles.authCard} aria-label="Account sign-in status">
            <div className={styles.authHeader}>
              <span className={styles.authTag}>
                {isSignedIn ? '● Signed In' : '○ Host Access'}
              </span>
              <h2 className={styles.authTitle}>
                {isSignedIn ? `Welcome back, ${displayName}` : 'Sign in to Save & Manage Invites'}
              </h2>
              <p className={styles.authCopy}>
                {isSignedIn
                  ? 'Your celebration drafts, custom pages, and guest RSVP lists are ready in your studio.'
                  : 'Use your Google account to keep drafts organized, track optional RSVPs, and share links anytime.'}
              </p>
            </div>

            <button
              type="button"
              className={styles.googleBtn}
              disabled={signingIn}
              aria-busy={signingIn || undefined}
              onClick={handleAuthClick}
            >
              <GoogleBadgeIcon />
              <span>
                {signingIn
                  ? 'Signing in...'
                  : isSignedIn
                  ? `Signed in as ${displayName} (Sign out)`
                  : 'Continue with Google'}
              </span>
            </button>
          </aside>
        </div>
      </section>

      <section className={styles.aboutSection} aria-labelledby="smileyyfy-about-heading">
        <div className={styles.sectionIntro}>
          <span className={styles.sectionKicker}>ABOUT SMILEYYFY</span>
          <h2 id="smileyyfy-about-heading" className={styles.sectionTitle}>
            {aboutTitle}
          </h2>
          <p className={styles.sectionDesc}>{aboutDescription}</p>
        </div>

        <div className={styles.pillarsGrid}>
          {HIGHLIGHTS.map((item) => (
            <article key={item.id} className={styles.pillarCard}>
              <div className={styles.pillarIcon} aria-hidden="true">
                {item.icon}
              </div>
              <h3 className={styles.pillarTitle}>{item.title}</h3>
              <p className={styles.pillarDesc}>{item.detail}</p>
              <button
                type="button"
                className={styles.pillarLinkBtn}
                onClick={() => onStartBuilding?.(item.preset)}
              >
                Try {item.icon} →
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.stepsSection} aria-label="How Smileyyfy works">
        <div className={styles.stepsRow}>
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className={styles.stepCard}>
              <span className={styles.stepNum}>{item.step}</span>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepCopy}>{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.formatsSection} aria-label="Popular celebration formats">
        <div className={styles.formatsHead}>
          <div>
            <h2 className={styles.sectionTitle}>Popular Ways People Use Smileyyfy</h2>
            <p className={styles.sectionDesc}>
              From traditional weddings to surprise proposals and milestone birthdays.
            </p>
          </div>
          <button
            type="button"
            className={styles.secondaryCta}
            onClick={() => onExploreTemplates?.()}
          >
            View Full Gallery
          </button>
        </div>

        <div className={styles.formatGrid}>
          {FEATURED_TEMPLATES.map((tpl) => (
            <article key={tpl.id} className={styles.formatCard}>
              <div className={styles.formatTop}>
                <span className={styles.formatEmoji} aria-hidden="true">
                  {tpl.emoji}
                </span>
                <span className={styles.formatCat}>{tpl.category}</span>
              </div>
              <h3 className={styles.formatTitle}>{tpl.title}</h3>
              <p className={styles.formatDesc}>{tpl.description}</p>
              <div className={styles.formatTags}>
                {tpl.tags.map((tag) => (
                  <span key={tag} className={styles.formatTag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className={styles.formatAction}
                onClick={() => onStartBuilding?.(tpl.id === 'love-proposal' ? 'proposal' : 'invitation')}
              >
                Customize This →
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SmileyyfyLandingShowcase;
