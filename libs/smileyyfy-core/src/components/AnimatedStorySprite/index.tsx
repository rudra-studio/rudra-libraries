import React, { useEffect, useState } from 'react';
import type StorySpriteScene from '../../utils/StorySpriteScene';
import styles from './styles.module.scss';

interface AnimatedStorySpriteProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|couple_hands|baby_walk|ring_sparkle|dancing_hearts|cake_celebration|custom_sprite */
  scene?: StorySpriteScene;
  /** @translate */
  caption?: string;
  /** @type|string */
  leftEmoji?: string;
  /** @type|string */
  rightEmoji?: string;
  /** @type|string */
  spriteSheetUrl?: string;
}

function AnimatedStorySprite({
  themeMode = 'light',
  scene = 'couple_hands',
  caption = 'Walking Hand in Hand Forever',
  leftEmoji = '🤵',
  rightEmoji = '👰',
  spriteSheetUrl = '',
}: AnimatedStorySpriteProps) {
  const [playing, setPlaying] = useState(true);
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    if (!playing || scene !== 'custom_sprite' || !spriteSheetUrl) return;
    const t = window.setInterval(() => setFrameIdx((f) => (f + 1) % 6), 140);
    return () => window.clearInterval(t);
  }, [playing, scene, spriteSheetUrl]);

  return (
    <div className={`${styles.box} ${styles[`mode_${themeMode}`] || styles.mode_light} ${!playing ? styles.paused : ''}`}>
      <div className={styles.stage} aria-hidden="true">
        {scene === 'couple_hands' && (
          <div className={styles.coupleScene}>
            <span className={styles.leftChar}>{leftEmoji || '🤵'}</span>
            <span className={styles.handsBridge}>🤝</span>
            <span className={styles.heartPop}>💖</span>
            <span className={styles.rightChar}>{rightEmoji || '👰'}</span>
          </div>
        )}
        {scene === 'baby_walk' && (
          <div className={styles.babyScene}>
            <div className={styles.footprintTrail}>👣 &nbsp; 👣 &nbsp; 👣</div>
            <div className={styles.babyWalker}>👶</div>
            <div className={styles.babyGoal}>🍼✨</div>
          </div>
        )}
        {scene === 'ring_sparkle' && (
          <div className={styles.ringScene}>
            <span className={styles.sparkleOrbit}>✨</span>
            <span className={styles.ringHero}>💍</span>
            <span className={styles.sparkleOrbitAlt}>💖</span>
          </div>
        )}
        {scene === 'dancing_hearts' && (
          <div className={styles.danceScene}>
            <span className={styles.musicFloat}>🎶</span>
            <span className={styles.dancerA}>💃</span>
            <span className={styles.dancerB}>🕺</span>
            <span className={styles.musicFloatAlt}>🎵</span>
          </div>
        )}
        {scene === 'cake_celebration' && (
          <div className={styles.cakeScene}>
            <span className={styles.balloonLeft}>🎈</span>
            <span className={styles.cakeHero}>🎂</span>
            <span className={styles.balloonRight}>🎉</span>
          </div>
        )}
        {scene === 'custom_sprite' &&
          (spriteSheetUrl ? (
            <div
              className={styles.customSpriteFrame}
              style={{
                backgroundImage: `url(${spriteSheetUrl})`,
                backgroundSize: '600% 100%',
                backgroundPosition: `${(frameIdx / 5) * 100}% 0%`,
              }}
            />
          ) : (
            <div className={styles.customStub}>🖼️ Add a horizontal sprite sheet URL</div>
          ))}
      </div>
      <div className={styles.footer}>
        <span className={styles.caption}>{caption}</span>
        <button type="button" className={styles.toggleBtn} onClick={() => setPlaying((p) => !p)}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>
    </div>
  );
}

export default AnimatedStorySprite;
