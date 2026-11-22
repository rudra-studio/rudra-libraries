import React, { useMemo, useState } from 'react';
import type RsvpGuestRecord from '../../utils/RsvpGuestRecord';
import styles from './styles.module.scss';

interface RsvpParticipantTrackerProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"boolean"} */
  enabled?: boolean;
  /** @translate */
  eventLabel?: string;
  /** @type|json */
  initialGuests?: RsvpGuestRecord[];
  /** @type|function */
  onRsvpSubmit?: (guest: RsvpGuestRecord) => void;
  /** @type|function */
  onGuestListChange?: (guests: RsvpGuestRecord[]) => void;
}

const DEFAULT_GUESTS: RsvpGuestRecord[] = [
  { id: 'g1', name: 'Priya Krishnan', contact: 'priya@example.com', status: 'attending', guests: 2, note: 'Vegetarian meals' },
  { id: 'g2', name: 'Karthik Nair', contact: 'karthik@example.com', status: 'attending', guests: 1, note: 'Can’t wait!' },
  { id: 'g3', name: 'Divya Menon', contact: 'divya@example.com', status: 'maybe', guests: 2, note: 'Confirming flight soon' },
];

function RsvpParticipantTracker({
  themeMode = 'light',
  enabled = true,
  eventLabel = 'Wedding & Event Guest List',
  initialGuests = DEFAULT_GUESTS,
  onRsvpSubmit,
  onGuestListChange,
}: RsvpParticipantTrackerProps) {
  const [guests, setGuests] = useState<RsvpGuestRecord[]>(
    Array.isArray(initialGuests) && initialGuests.length > 0 ? initialGuests : DEFAULT_GUESTS
  );
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'attending' | 'maybe' | 'declined'>('attending');
  const [partySize, setPartySize] = useState(1);
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState<'all' | 'attending' | 'maybe' | 'declined'>('all');
  const [search, setSearch] = useState('');
  const [copiedMsg, setCopiedMsg] = useState('');

  const stats = useMemo(() => {
    const attending = guests.filter((g) => g.status === 'attending');
    const maybe = guests.filter((g) => g.status === 'maybe');
    const declined = guests.filter((g) => g.status === 'declined');
    const totalHeadcount = attending.reduce((sum, g) => sum + (Number(g.guests) || 1), 0);
    return {
      totalResponses: guests.length,
      attendingCount: attending.length,
      totalHeadcount,
      maybeCount: maybe.length,
      declinedCount: declined.length,
    };
  }, [guests]);

  const visibleGuests = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter((g) => {
      if (filter !== 'all' && g.status !== filter) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.contact.toLowerCase().includes(q) ||
        (g.note || '').toLowerCase().includes(q)
      );
    });
  }, [guests, filter, search]);

  if (!enabled) {
    return (
      <div className={`${styles.disabledBox} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
        <strong>Participant RSVP Tracking is turned off (Optional)</strong>
        <p>Enable RSVP tracking in the invite builder whenever you want to collect guest responses and headcounts.</p>
      </div>
    );
  }

  const handleAddRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const record: RsvpGuestRecord = {
      id: `g_${Date.now()}`,
      name: name.trim(),
      contact: contact.trim() || 'Not provided',
      status,
      guests: Math.max(1, Math.min(10, Number(partySize) || 1)),
      note: note.trim(),
    };
    const next = [record, ...guests];
    setGuests(next);
    onRsvpSubmit?.(record);
    onGuestListChange?.(next);
    setName('');
    setContact('');
    setPartySize(1);
    setNote('');
  };

  const removeGuest = (id: string) => {
    const next = guests.filter((g) => g.id !== id);
    setGuests(next);
    onGuestListChange?.(next);
  };

  const copySummary = () => {
    const csv = ['Name,Contact,Status,Guests,Note']
      .concat(guests.map((g) => `"${g.name}","${g.contact}",${g.status},${g.guests},"${g.note || ''}"`))
      .join('\n');
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(csv).catch(() => {});
    }
    setCopiedMsg('Guest CSV copied!');
    window.setTimeout(() => setCopiedMsg(''), 2200);
  };

  return (
    <section className={`${styles.wrap} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.topRow}>
        <div>
          <h3 className={styles.title}>📋 {eventLabel}</h3>
          <p className={styles.sub}>Optional participant tracking — collect RSVPs, party sizes, and notes.</p>
        </div>
        <button type="button" className={styles.exportBtn} onClick={copySummary}>
          📥 Copy Guest CSV
        </button>
      </div>

      {copiedMsg && (
        <div className={styles.notice} role="status">
          {copiedMsg}
        </div>
      )}

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiNum}>{stats.totalResponses}</span>
          <span className={styles.kpiLbl}>Responses</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiNum}>{stats.totalHeadcount}</span>
          <span className={styles.kpiLbl}>Confirmed Headcount</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiNum}>{stats.maybeCount}</span>
          <span className={styles.kpiLbl}>Maybe</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiNum}>{stats.declinedCount}</span>
          <span className={styles.kpiLbl}>Declined</span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleAddRsvp}>
        <input
          type="text"
          required
          placeholder="Guest full name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email or phone"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as 'attending' | 'maybe' | 'declined')}>
          <option value="attending">✅ Attending</option>
          <option value="maybe">🤔 Maybe</option>
          <option value="declined">❌ Declined</option>
        </select>
        <input
          type="number"
          min={1}
          max={10}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value) || 1)}
          aria-label="Party size"
        />
        <input
          type="text"
          placeholder="Dietary preference or wish"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit" className={styles.submitBtn}>
          + Record RSVP
        </button>
      </form>

      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          {(['all', 'attending', 'maybe', 'declined'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tabBtn} ${filter === tab ? styles.activeTab : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search guests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.list}>
        {visibleGuests.length === 0 ? (
          <div className={styles.empty}>No guests match this filter yet.</div>
        ) : (
          visibleGuests.map((g) => (
            <div key={g.id} className={styles.guestRow}>
              <div>
                <div className={styles.guestName}>
                  {g.name} <span className={styles.sizeTag}>+{g.guests}</span>
                </div>
                <div className={styles.guestMeta}>
                  {g.contact}
                  {g.note ? ` • ${g.note}` : ''}
                </div>
              </div>
              <div className={styles.rightActions}>
                <span className={`${styles.statusPill} ${styles[`st_${g.status}`]}`}>{g.status}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  aria-label={`Remove ${g.name}`}
                  onClick={() => removeGuest(g.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default RsvpParticipantTracker;
