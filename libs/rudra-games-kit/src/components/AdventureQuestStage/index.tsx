import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface AdventureChoiceItem {
  id: string;
  label: string;
  outcomeText: string;
  hpDelta?: number;
  scoreDelta?: number;
}

export interface AdventureQuestStageProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  questTitle?: string;
  /** @translate */
  sceneNarrative?: string;
  /** @type|json */
  choices?: AdventureChoiceItem[];
  /** @type|function */
  onChoiceSelect?: (choiceId: string) => void;
}

const DEFAULT_CHOICES: AdventureChoiceItem[] = [
  { id: 'c1', label: 'Cross the Crystal Bridge', outcomeText: 'You spot a hidden relic cache with zero damage.', hpDelta: 0, scoreDelta: 25 },
  { id: 'c2', label: 'Explore the Shadow Cavern', outcomeText: 'A guardian swarm strikes, but you claim rare shards.', hpDelta: -20, scoreDelta: 50 },
  { id: 'c3', label: 'Rest at the Waystone', outcomeText: 'You recover vitality and scout the next sector.', hpDelta: 15, scoreDelta: 10 },
];

export function AdventureQuestStage({
  themeMode = 'dark',
  questTitle = 'Chronicles of Rudra Realms',
  sceneNarrative = 'At the crossroads of the floating citadel, three paths open before your party.',
  choices = DEFAULT_CHOICES,
  onChoiceSelect,
}: AdventureQuestStageProps) {
  const list = Array.isArray(choices) && choices.length > 0 ? choices : DEFAULT_CHOICES;
  const [hp, setHp] = useState(100);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState('Choose a path to begin your quest.');

  const choose = (item: AdventureChoiceItem) => {
    const nextHp = Math.max(0, Math.min(100, hp + (Number(item.hpDelta) || 0)));
    const nextScore = Math.max(0, score + (Number(item.scoreDelta) || 0));
    setHp(nextHp);
    setScore(nextScore);
    setLog(item.outcomeText);
    onChoiceSelect?.(item.id);
  };

  const restartQuest = () => {
    setHp(100);
    setScore(0);
    setLog('Quest reset. Choose a path to begin.');
  };

  return (
    <div className={`${styles.box} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}>
      <div className={styles.topBar}>
        <div>
          <h3 className={styles.title}>{questTitle}</h3>
          <div className={styles.stats}>
            HP: {hp}/100 • XP: {score}
          </div>
        </div>
        <button type="button" className={styles.resetBtn} onClick={restartQuest}>
          Restart Quest
        </button>
      </div>

      <p className={styles.narrative}>{sceneNarrative}</p>

      <div className={styles.choiceList}>
        {list.map((c) => (
          <button key={c.id} type="button" className={styles.choiceBtn} onClick={() => choose(c)}>
            <span>{c.label}</span>
            <span className={styles.badge}>
              {(c.scoreDelta ?? 0) >= 0 ? `+${c.scoreDelta ?? 0} XP` : `${c.scoreDelta} XP`}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.logBox} role="status">
        {log}
      </div>
    </div>
  );
}
export default AdventureQuestStage;
