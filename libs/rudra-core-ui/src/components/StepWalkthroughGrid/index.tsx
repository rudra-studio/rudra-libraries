import React from 'react';
import type { CoreStepItem } from '../../utils/CoreStepItem';
import styles from './styles.module.scss';

interface StepWalkthroughGridProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  heading?: string;
  /** @type|json */
  steps?: CoreStepItem[];
}

const DEFAULT_STEPS: CoreStepItem[] = [
  {
    step: '01',
    title: 'Choose a Template or Preset',
    description: 'Pick a wedding invite, love proposal, birthday celebration, or anniversary layout.',
  },
  {
    step: '02',
    title: 'Customize & Add Media',
    description: 'Edit text in multiple languages, add photos or sprite animations, and attach music.',
  },
  {
    step: '03',
    title: 'Share & Collect Optional RSVPs',
    description: 'Publish your link and track guest responses whenever RSVP tracking is enabled.',
  },
];

function StepWalkthroughGrid({
  themeMode = 'light',
  heading = 'How It Works',
  steps = DEFAULT_STEPS,
}: StepWalkthroughGridProps) {
  const list = Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section className={`${styles.section} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div className={styles.row}>
        {list.map((item) => (
          <div key={item.step} className={styles.card}>
            <span className={styles.num}>{item.step}</span>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.desc}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StepWalkthroughGrid;
