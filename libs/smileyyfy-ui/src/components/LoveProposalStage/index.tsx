import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface ProposalPhotoItem {
  url: string;
  caption: string;
}

export interface LoveProposalStageProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|blush|starlit|golden */
  romanticTheme?: 'blush' | 'starlit' | 'golden';
  /** @translate */
  recipientName?: string;
  /** @translate */
  senderName?: string;
  /** @translate */
  headline?: string;
  /** @translate */
  loveNote?: string;
  /** @type|json */
  photos?: ProposalPhotoItem[];
  /** @type|function */
  onAccept?: (payload: { recipientName: string; senderName: string; dodgeCount: number }) => void;
  /** @type|function */
  onShareProposal?: (summary: string) => void;
}

const NO_MESSAGES = [
  'No 🙈',
  'Are you sure? 🥺',
  'Think again! 💭',
  'Nice try! 😜',
  'Can’t catch me! 💨',
  'Pretty please? 💖',
  'Only YES works! 💘',
];

const DEFAULT_PHOTOS: ProposalPhotoItem[] = [
  { url: '', caption: 'Our First Coffee Date ☕' },
  { url: '', caption: 'Sunset Walks Together 🌅' },
  { url: '', caption: 'Forever Starts Now 💍' },
];

export function LoveProposalStage({
  themeMode = 'light',
  romanticTheme = 'blush',
  recipientName = 'My Favorite Person',
  senderName = 'Yours Forever',
  headline = 'Will You Marry Me? 💖',
  loveNote = 'Every laugh, every quiet moment, and every adventure with you has been the best part of my life. Let’s write the rest of our story together.',
  photos = DEFAULT_PHOTOS,
  onAccept,
  onShareProposal,
}: LoveProposalStageProps) {
  const [viewMode, setViewMode] = useState<'experience' | 'customize'>('experience');
  const [stylePreset, setStylePreset] = useState<'blush' | 'starlit' | 'golden'>(romanticTheme);
  const [recipient, setRecipient] = useState(recipientName);
  const [sender, setSender] = useState(senderName);
  const [title, setTitle] = useState(headline);
  const [note, setNote] = useState(loveNote);
  const [gallery, setGallery] = useState<ProposalPhotoItem[]>(
    Array.isArray(photos) && photos.length > 0 ? photos : DEFAULT_PHOTOS
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  const [accepted, setAccepted] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPos, setNoPos] = useState<{ top: number; left: number } | null>(null);
  const [shareToast, setShareToast] = useState('');

  const flyAwayNoButton = () => {
    const nextTop = 14 + Math.floor(Math.random() * 68);
    const nextLeft = 10 + Math.floor(Math.random() * 72);
    setNoPos({ top: nextTop, left: nextLeft });
    setDodgeCount((c) => c + 1);
  };

  const handleSayYes = () => {
    setAccepted(true);
    onAccept?.({ recipientName: recipient, senderName: sender, dodgeCount });
  };

  const handleReplay = () => {
    setAccepted(false);
    setDodgeCount(0);
    setNoPos(null);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoCaption.trim() && !newPhotoUrl.trim()) return;
    setGallery((prev) => [
      ...prev,
      { url: newPhotoUrl.trim(), caption: newPhotoCaption.trim() || 'Special Memory 💖' },
    ]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleShare = () => {
    const summary = `${title} — A Smileyyfy Love Proposal for ${recipient} from ${sender}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(summary).catch(() => {});
    }
    onShareProposal?.(summary);
    setShareToast('Proposal link summary copied!');
    window.setTimeout(() => setShareToast(''), 2400);
  };

  const yesScale = Math.min(1.42, 1 + dodgeCount * 0.07);
  const noLabel = NO_MESSAGES[dodgeCount % NO_MESSAGES.length];

  return (
    <div className={`${styles.shell} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.toolbar}>
        <div className={styles.modeSwitch}>
          <button
            type="button"
            className={`${styles.tab} ${viewMode === 'experience' ? styles.activeTab : ''}`}
            onClick={() => setViewMode('experience')}
          >
            💘 Live Proposal Experience
          </button>
          <button
            type="button"
            className={`${styles.tab} ${viewMode === 'customize' ? styles.activeTab : ''}`}
            onClick={() => setViewMode('customize')}
          >
            🎨 Customize Text & Photos
          </button>
        </div>

        <div className={styles.presetPills}>
          {(['blush', 'starlit', 'golden'] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              className={`${styles.presetBtn} ${stylePreset === preset ? styles.activePreset : ''}`}
              onClick={() => setStylePreset(preset)}
            >
              {preset === 'blush' ? '🌸 Blush' : preset === 'starlit' ? '🌌 Starlit' : '✨ Golden'}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'customize' ? (
        <div className={styles.builderGrid}>
          <div className={styles.formCol}>
            <label className={styles.field}>
              <span>To (Recipient Name)</span>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>From (Your Name)</span>
              <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Proposal Headline</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Custom Love Letter</span>
              <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            <button type="button" className={styles.previewNowBtn} onClick={() => setViewMode('experience')}>
              ✨ Preview Interactive Proposal
            </button>
          </div>

          <div className={styles.photoCol}>
            <h4 className={styles.photoHeading}>📸 Custom Photo Memories</h4>
            <form className={styles.photoForm} onSubmit={handleAddPhoto}>
              <input
                type="url"
                placeholder="Photo URL (https://...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="Memory caption"
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
              />
              <button type="submit" className={styles.addPhotoBtn}>
                + Add Photo
              </button>
            </form>
            <div className={styles.photoChips}>
              {gallery.map((item, i) => (
                <div key={`${item.caption}-${i}`} className={styles.photoItemRow}>
                  <span>🖼️ {item.caption}</span>
                  <button
                    type="button"
                    className={styles.delBtn}
                    onClick={() => setGallery((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styles.stage} ${styles[`theme_${stylePreset}`] || styles.theme_blush}`}>
          <div className={styles.heartsBg} aria-hidden="true">
            {Array.from({ length: accepted ? 22 : 12 }, (_, idx) => (
              <span
                key={idx}
                className={styles.floatingHeart}
                style={{
                  left: `${(idx * 29 + 7) % 92}%`,
                  animationDelay: `${(idx % 6) * 0.55}s`,
                  animationDuration: `${accepted ? 2.6 + (idx % 3) : 4.2 + (idx % 4)}s`,
                }}
              >
                {accepted ? (idx % 2 === 0 ? '💖' : '🎉') : idx % 2 === 0 ? '💕' : '✨'}
              </span>
            ))}
          </div>

          <div className={styles.stageInner}>
            <span className={styles.dearTag}>Dear {recipient},</span>
            <h2 className={styles.heroTitle}>{accepted ? 'YAY!! Forever Begins Today! 💍💖' : title}</h2>
            <p className={styles.loveLetter}>{note}</p>

            <div className={styles.polaroidRow}>
              {gallery.map((photo, idx) => (
                <figure
                  key={`${photo.caption}-${idx}`}
                  className={styles.polaroid}
                  style={{ transform: `rotate(${idx % 2 === 0 ? -3 : 3}deg)` }}
                >
                  {photo.url ? (
                    <img src={photo.url} alt={photo.caption} className={styles.polaroidImg} />
                  ) : (
                    <div className={styles.polaroidPlaceholder}>
                      <span>{idx % 3 === 0 ? '💑' : idx % 3 === 1 ? '🌹' : '💖'}</span>
                    </div>
                  )}
                  <figcaption className={styles.polaroidCap}>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>

            {accepted ? (
              <div className={styles.celebrationBox}>
                <p className={styles.acceptedText}>
                  💖 {recipient} said <strong>YES</strong> to {sender}!
                  {dodgeCount > 0 ? ` (after chasing the No button ${dodgeCount} times 😉)` : ''}
                </p>
                <div className={styles.postActions}>
                  <button type="button" className={styles.yesBtn} onClick={handleShare}>
                    🔗 Share This Moment
                  </button>
                  <button type="button" className={styles.replayBtn} onClick={handleReplay}>
                    ↺ Replay Proposal
                  </button>
                </div>
                {shareToast && <div className={styles.shareToast}>{shareToast}</div>}
              </div>
            ) : (
              <div className={styles.buttonArena}>
                <button
                  type="button"
                  className={styles.yesBtn}
                  style={{ transform: `scale(${yesScale})` }}
                  onClick={handleSayYes}
                >
                  Yes, Forever! 💖
                </button>

                <button
                  type="button"
                  className={styles.noBtn}
                  style={
                    noPos
                      ? {
                          position: 'absolute',
                          top: `${noPos.top}%`,
                          left: `${noPos.left}%`,
                          transform: 'translate(-50%, -50%)',
                        }
                      : undefined
                  }
                  onMouseEnter={flyAwayNoButton}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    flyAwayNoButton();
                  }}
                  onClick={flyAwayNoButton}
                >
                  {noLabel}
                </button>
              </div>
            )}

            <div className={styles.signature}>With all my love, — {sender}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoveProposalStage;
