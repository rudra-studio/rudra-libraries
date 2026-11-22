import React, { useMemo, useState } from 'react';
import type InviteConfigPayload from '../../utils/InviteConfigPayload';
import styles from './styles.module.scss';

interface WeddingInviteBuilderProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|Wedding|Engagement|Birthday|Anniversary|Party */
  defaultEventType?: 'Wedding' | 'Engagement' | 'Birthday' | 'Anniversary' | 'Party';
  /** @translate */
  defaultHostNames?: string;
  /** @translate */
  defaultEventTitle?: string;
  /** @translate */
  defaultDate?: string;
  /** @translate */
  defaultVenue?: string;
  /** @schema {"type":"boolean"} */
  enableRsvpTracking?: boolean;
  /** @type|function */
  onInviteChange?: (invite: InviteConfigPayload) => void;
  /** @type|function */
  onPublishInvite?: (invite: InviteConfigPayload) => void;
  /** @type|function */
  onToggleRsvp?: (enabled: boolean) => void;
}

const PALETTES = [
  { id: 'rosegold', label: 'Rose Gold' },
  { id: 'emerald', label: 'Royal Emerald' },
  { id: 'starlight', label: 'Midnight Starlight' },
  { id: 'sunset', label: 'Sunset Peach' },
];

function WeddingInviteBuilder({
  themeMode = 'light',
  defaultEventType = 'Wedding',
  defaultHostNames = 'Aarav & Meera',
  defaultEventTitle = 'Together Forever — Wedding Celebration',
  defaultDate = '2026-12-20',
  defaultVenue = 'The Lotus Pavilion, ECR, Chennai',
  enableRsvpTracking = true,
  onInviteChange,
  onPublishInvite,
  onToggleRsvp,
}: WeddingInviteBuilderProps) {
  const [eventType, setEventType] = useState<string>(defaultEventType);
  const [palette, setPalette] = useState<string>('rosegold');
  const [hostNames, setHostNames] = useState<string>(defaultHostNames);
  const [eventTitle, setEventTitle] = useState<string>(defaultEventTitle);
  const [eventDate, setEventDate] = useState<string>(defaultDate);
  const [eventTime, setEventTime] = useState<string>('06:30 PM');
  const [venue, setVenue] = useState<string>(defaultVenue);
  const [message, setMessage] = useState<string>(
    'With joyful hearts, we invite you to celebrate our special day filled with love, laughter, and timeless memories.'
  );
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string>('');
  const [rsvpEnabled, setRsvpEnabled] = useState<boolean>(enableRsvpTracking);
  const [statusNotice, setStatusNotice] = useState<string>('');

  const payload: InviteConfigPayload = useMemo(
    () => ({
      eventType,
      palette,
      hostNames,
      eventTitle,
      eventDate,
      eventTime,
      venue,
      message,
      coverPhotoUrl,
      enableRsvpTracking: rsvpEnabled,
    }),
    [eventType, palette, hostNames, eventTitle, eventDate, eventTime, venue, message, coverPhotoUrl, rsvpEnabled]
  );

  const daysUntil = useMemo(() => {
    const parsed = Date.parse(eventDate);
    if (Number.isNaN(parsed)) return null;
    const diff = Math.ceil((parsed - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [eventDate]);

  const emitUpdate = (overrides: Partial<InviteConfigPayload>) => {
    const next = { ...payload, ...overrides };
    onInviteChange?.(next);
  };

  const handleCopyShare = () => {
    const slug = (hostNames || 'event')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const shareText = `${eventTitle} (${hostNames}) — ${eventDate} at ${eventTime}, ${venue} | smileyyfy.app/i/${slug || 'invite'}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
    setStatusNotice('Shareable invite link copied!');
    window.setTimeout(() => setStatusNotice(''), 2500);
  };

  const handlePublish = () => {
    onPublishInvite?.(payload);
    setStatusNotice('Invite snapshot published to Smileyyfy!');
    window.setTimeout(() => setStatusNotice(''), 2800);
  };

  return (
    <div className={`${styles.wrapper} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.editorCol}>
        <div className={styles.sectionHead}>
          <h2 className={styles.heading}>💌 Event & Wedding Invite Studio</h2>
          <p className={styles.sub}>Customize every detail and preview your invite live.</p>
        </div>

        <div className={styles.row2}>
          <label className={styles.field}>
            <span>Occasion Type</span>
            <select
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
                emitUpdate({ eventType: e.target.value });
              }}
            >
              <option value="Wedding">💍 Wedding</option>
              <option value="Engagement">💐 Engagement</option>
              <option value="Birthday">🎂 Birthday</option>
              <option value="Anniversary">🥂 Anniversary</option>
              <option value="Party">🎉 Party / Meetup</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Card Theme</span>
            <select
              value={palette}
              onChange={(e) => {
                setPalette(e.target.value);
                emitUpdate({ palette: e.target.value });
              }}
            >
              {PALETTES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={styles.field}>
          <span>Couple / Host Names</span>
          <input
            type="text"
            value={hostNames}
            onChange={(e) => {
              setHostNames(e.target.value);
              emitUpdate({ hostNames: e.target.value });
            }}
            placeholder="e.g., Aarav & Meera"
          />
        </label>

        <label className={styles.field}>
          <span>Invitation Headline</span>
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => {
              setEventTitle(e.target.value);
              emitUpdate({ eventTitle: e.target.value });
            }}
            placeholder="Together Forever"
          />
        </label>

        <div className={styles.row2}>
          <label className={styles.field}>
            <span>Event Date</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => {
                setEventDate(e.target.value);
                emitUpdate({ eventDate: e.target.value });
              }}
            />
          </label>

          <label className={styles.field}>
            <span>Start Time</span>
            <input
              type="text"
              value={eventTime}
              onChange={(e) => {
                setEventTime(e.target.value);
                emitUpdate({ eventTime: e.target.value });
              }}
              placeholder="06:30 PM"
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>Venue / Location</span>
          <input
            type="text"
            value={venue}
            onChange={(e) => {
              setVenue(e.target.value);
              emitUpdate({ venue: e.target.value });
            }}
            placeholder="Venue address or online link"
          />
        </label>

        <label className={styles.field}>
          <span>Cover Photo URL (Optional)</span>
          <input
            type="url"
            value={coverPhotoUrl}
            onChange={(e) => {
              setCoverPhotoUrl(e.target.value);
              emitUpdate({ coverPhotoUrl: e.target.value });
            }}
            placeholder="https://images.unsplash.com/..."
          />
        </label>

        <label className={styles.field}>
          <span>Personal Invitation Note</span>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              emitUpdate({ message: e.target.value });
            }}
          />
        </label>

        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={rsvpEnabled}
            onChange={(e) => {
              const checked = e.target.checked;
              setRsvpEnabled(checked);
              onToggleRsvp?.(checked);
              emitUpdate({ enableRsvpTracking: checked });
            }}
          />
          <span>Enable Optional Guest / Participant RSVP Tracking</span>
        </label>

        <div className={styles.actionRow}>
          <button type="button" className={styles.primaryBtn} onClick={handlePublish}>
            ✨ Publish Invite
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={handleCopyShare}>
            🔗 Copy Share Link
          </button>
        </div>

        {statusNotice && (
          <div className={styles.toast} role="status">
            {statusNotice}
          </div>
        )}
      </div>

      <div className={styles.previewCol}>
        <div className={`${styles.inviteCard} ${styles[`pal_${palette}`] || styles.pal_rosegold}`}>
          <div className={styles.cardTopMeta}>
            <span className={styles.badge}>{eventType.toUpperCase()} INVITATION</span>
            {daysUntil !== null && (
              <span className={styles.countdown}>
                {daysUntil > 0 ? `${daysUntil} days to go` : daysUntil === 0 ? 'Today!' : 'Celebrated'}
              </span>
            )}
          </div>

          {coverPhotoUrl && (
            <div className={styles.coverWrap}>
              <img src={coverPhotoUrl} alt={eventTitle} className={styles.coverImg} />
            </div>
          )}

          <div className={styles.ornament} aria-hidden="true">
            ✦ ❀ ✦
          </div>
          <h3 className={styles.couple}>{hostNames || 'Your Names Here'}</h3>
          <p className={styles.cardHeadline}>{eventTitle || 'Special Celebration'}</p>
          <p className={styles.cardMessage}>{message}</p>

          <div className={styles.detailGrid}>
            <div className={styles.detailBox}>
              <span className={styles.detailLabel}>DATE</span>
              <strong>{eventDate || 'TBD'}</strong>
            </div>
            <div className={styles.detailBox}>
              <span className={styles.detailLabel}>TIME</span>
              <strong>{eventTime || 'TBD'}</strong>
            </div>
          </div>

          <div className={styles.venueBox}>
            <span className={styles.detailLabel}>VENUE</span>
            <strong>📍 {venue || 'Location TBD'}</strong>
          </div>

          <div className={styles.cardFooter}>
            <span>{rsvpEnabled ? '✅ RSVP Tracking Enabled' : '✨ Open Invite (No RSVP Required)'}</span>
            <span>Crafted with Smileyyfy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeddingInviteBuilder;
