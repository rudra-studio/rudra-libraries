import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface OccasionTemplateItem {
  id: string;
  title: string;
  category: 'Weddings & Events' | 'Romance' | 'Milestones';
  emoji: string;
  description: string;
  tags: string[];
  routeHint: string;
}

export interface OccasionTemplateGalleryProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  heading?: string;
  /** @translate */
  subheading?: string;
  /** @type|function */
  onSelectTemplate?: (template: OccasionTemplateItem) => void;
}

const TEMPLATES: OccasionTemplateItem[] = [
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
  {
    id: 'anniversary-story',
    title: 'Anniversary Memory Timeline',
    category: 'Romance',
    emoji: '🥂',
    description: 'Romantic photo cards and heartfelt notes celebrating milestones together with golden sparkle animations.',
    tags: ['Sparkles', 'Custom Photos', 'Love Letter'],
    routeHint: '/proposal',
  },
  {
    id: 'engagement-save-date',
    title: 'Engagement Save-the-Date',
    category: 'Weddings & Events',
    emoji: '💐',
    description: 'Rose-gold digital save-the-date card ready to share with friends and family across WhatsApp & social.',
    tags: ['Rose Gold', 'Instant Share', 'Optional RSVP'],
    routeHint: '/invites',
  },
  {
    id: 'baby-shower',
    title: 'Baby Shower & Celebration Hub',
    category: 'Milestones',
    emoji: '🍼',
    description: 'Pastel event invite with optional dietary notes, guest count tracking, and floating petal animations.',
    tags: ['Floating Petals', 'Guest Notes', 'Mobile Friendly'],
    routeHint: '/invites',
  },
];

export function OccasionTemplateGallery({
  themeMode = 'light',
  heading = 'Celebration Templates — Invites, Proposals & Many More',
  subheading = 'Pick a reusable Smileyyfy experience to customize with your own text, photos, and animations.',
  onSelectTemplate,
}: OccasionTemplateGalleryProps) {
  const [category, setCategory] = useState<string>('All');
  const [selectedId, setSelectedId] = useState<string>('');

  const filtered = category === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category);

  return (
    <section className={`${styles.wrap} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.sub}>{subheading}</p>
        </div>

        <div className={styles.filters}>
          {['All', 'Weddings & Events', 'Romance', 'Milestones'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.filterBtn} ${category === cat ? styles.activeFilter : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((item) => {
          const isPicked = selectedId === item.id;
          return (
            <article key={item.id} className={`${styles.card} ${isPicked ? styles.pickedCard : ''}`}>
              <div className={styles.cardTop}>
                <span className={styles.emoji} aria-hidden="true">
                  {item.emoji}
                </span>
                <span className={styles.catBadge}>{item.category}</span>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
              <div className={styles.tagRow}>
                {item.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className={styles.launchBtn}
                onClick={() => {
                  setSelectedId(item.id);
                  onSelectTemplate?.(item);
                }}
              >
                {isPicked ? '✓ Selected — Open Studio' : 'Use Template →'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default OccasionTemplateGallery;
