import React, { useMemo, useState } from 'react';
import extractYouTubeId from '../../utils/extractYouTubeId';
import styles from './styles.module.scss';

interface YouTubeMediaWidgetProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|audio|video */
  mediaMode?: 'audio' | 'video';
  /** @translate */
  youtubeUrl?: string;
  /** @translate */
  title?: string;
  /** @schema {"type":"boolean"} */
  autoPlay?: boolean;
  /** @schema {"type":"boolean"} */
  loop?: boolean;
  /** @type|function */
  onTogglePlay?: (isPlaying: boolean) => void;
}

function YouTubeMediaWidget({
  themeMode = 'light',
  mediaMode = 'audio',
  youtubeUrl = 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
  title = 'Our Romantic Soundtrack',
  autoPlay = true,
  loop = true,
  onTogglePlay,
}: YouTubeMediaWidgetProps) {
  const [playing, setPlaying] = useState<boolean>(Boolean(autoPlay));
  const [muted, setMuted] = useState<boolean>(false);

  const videoId = useMemo(() => extractYouTubeId(youtubeUrl), [youtubeUrl]);

  const audioEmbedSrc = useMemo(() => {
    if (!videoId || !playing) return '';
    const params = new URLSearchParams({
      autoplay: '1',
      loop: '1',
      playlist: videoId,
      controls: '0',
      modestbranding: '1',
      rel: '0',
      mute: muted ? '1' : '0',
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, playing, muted]);

  const videoEmbedSrc = useMemo(() => {
    if (!videoId) return '';
    const params = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      loop: loop ? '1' : '0',
      rel: '0',
      modestbranding: '1',
    });
    if (loop) {
      params.set('playlist', videoId);
    }
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, autoPlay, loop]);

  const handleTogglePlay = () => {
    const next = !playing;
    setPlaying(next);
    onTogglePlay?.(next);
  };

  if (!videoId) {
    return (
      <div className={`${styles.emptyBox} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
        <span>{mediaMode === 'audio' ? '🎵' : '🎬'} Paste a valid YouTube URL or 11-character video ID to play.</span>
      </div>
    );
  }

  if (mediaMode === 'audio') {
    return (
      <div className={`${styles.audioBar} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
        <div className={styles.audioLeft}>
          <span className={`${styles.eqBadge} ${playing && !muted ? styles.eqActive : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <div>
            <div className={styles.trackTitle}>{title || 'Background Song'}</div>
            <div className={styles.trackMeta}>
              {playing ? (muted ? 'Muted • Repeat Loop' : 'Playing Song • Repeat Loop 🔁') : 'Paused • Audio-Only YouTube'}
            </div>
          </div>
        </div>

        <div className={styles.audioActions}>
          <button type="button" className={styles.controlBtn} onClick={handleTogglePlay}>
            {playing ? '⏸ Pause' : '▶ Play Song'}
          </button>
          {playing && (
            <button
              type="button"
              className={styles.ghostBtn}
              aria-label={muted ? 'Unmute song' : 'Mute song'}
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          )}
        </div>

        {playing && audioEmbedSrc && (
          <iframe
            className={styles.hiddenAudioFrame}
            src={audioEmbedSrc}
            title={`${title} audio player`}
            allow="autoplay; encrypted-media"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.videoCard} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.videoTop}>
        <span className={styles.trackTitle}>🎬 {title || 'Celebration Video'}</span>
        {loop && <span className={styles.loopChip}>🔁 Repeat On</span>}
      </div>
      <div className={styles.videoFrameWrap}>
        <iframe
          className={styles.videoFrame}
          src={videoEmbedSrc}
          title={title || 'YouTube Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default YouTubeMediaWidget;
