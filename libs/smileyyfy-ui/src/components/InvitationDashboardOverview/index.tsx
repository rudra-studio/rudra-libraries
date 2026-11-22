import React, { useMemo, useState } from 'react';
import type RsvpGuestRecord from '../../utils/RsvpGuestRecord';
import styles from './styles.module.scss';

export interface SmileyyfyDashboardInvitation {
  id: string;
  title: string;
  occasion: string;
  eventDate: string;
  venue: string;
  status: 'active' | 'draft' | 'archived';
  templateId?: string;
  rsvpList: RsvpGuestRecord[];
}

interface InvitationDashboardOverviewProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|string */
  signedInUserName?: string;
  /** @type|string */
  signedInUserEmail?: string;
  /** @type|json */
  invitations?: SmileyyfyDashboardInvitation[];
  /** @type|function */
  onEditInvitation?: (invitation: SmileyyfyDashboardInvitation) => void;
  /** @type|function */
  onPreviewInvitation?: (invitation: SmileyyfyDashboardInvitation) => void;
  /** @type|function */
  onUpdateGuests?: (invitationId: string, updatedList: RsvpGuestRecord[]) => void;
  /** @type|function */
  onCreateNew?: () => void;
}

const DEFAULT_INVITATIONS: SmileyyfyDashboardInvitation[] = [
  {
    id: 'inv_wedding_1',
    title: 'Aarav & Meera — Royal Wedding',
    occasion: 'Wedding',
    eventDate: '2026-12-20',
    venue: 'The Lotus Pavilion, ECR, Chennai',
    status: 'active',
    templateId: 'tpl_royal_maroon',
    rsvpList: [
      { id: 'r1', name: 'Priya Krishnan', contact: 'priya@example.com', status: 'attending', guests: 2, note: 'Vegetarian meals' },
      { id: 'r2', name: 'Karthik Nair', contact: 'karthik@example.com', status: 'attending', guests: 1, note: 'Excited for the evening!' },
      { id: 'r3', name: 'Divya Menon', contact: 'divya@example.com', status: 'maybe', guests: 2, note: 'Checking travel dates' },
    ],
  },
  {
    id: 'inv_proposal_2',
    title: 'Sunset Beach Proposal Surprise',
    occasion: 'Proposal',
    eventDate: '2026-12-12',
    venue: 'Kovalam Cliffside',
    status: 'active',
    templateId: 'tpl_blush_hearts',
    rsvpList: [
      { id: 'r4', name: 'Meera Sundaram', contact: 'meera@example.com', status: 'attending', guests: 1, note: 'Say YES!' },
    ],
  },
  {
    id: 'inv_bday_3',
    title: 'Riya’s 25th Rooftop Bash',
    occasion: 'Birthday',
    eventDate: '2027-01-08',
    venue: 'Sky Deck, Bengaluru',
    status: 'draft',
    templateId: 'tpl_neon_party',
    rsvpList: [
      { id: 'r5', name: 'Rohan Das', contact: 'rohan@example.com', status: 'declined', guests: 1, note: 'Out of town' },
    ],
  },
];

function InvitationDashboardOverview({
  themeMode = 'light',
  signedInUserName = '',
  signedInUserEmail = '',
  invitations = DEFAULT_INVITATIONS,
  onEditInvitation,
  onPreviewInvitation,
  onUpdateGuests,
  onCreateNew,
}: InvitationDashboardOverviewProps) {
  const [items, setItems] = useState<SmileyyfyDashboardInvitation[]>(
    Array.isArray(invitations) && invitations.length > 0 ? invitations : DEFAULT_INVITATIONS
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [expandedId, setExpandedId] = useState<string>(() => {
    const list = Array.isArray(invitations) && invitations.length > 0 ? invitations : DEFAULT_INVITATIONS;
    return list[0]?.id || '';
  });
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [guestStatus, setGuestStatus] = useState<'attending' | 'maybe' | 'declined'>('attending');
  const [guestCount, setGuestCount] = useState(1);
  const [guestNote, setGuestNote] = useState('');

  const metrics = useMemo(() => {
    const activeCount = items.filter((i) => i.status === 'active').length;
    const totalRsvps = items.reduce((acc, inv) => acc + (inv.rsvpList?.length || 0), 0);
    const confirmedHeadcount = items.reduce(
      (acc, inv) =>
        acc +
        (inv.rsvpList || [])
          .filter((r) => r.status === 'attending')
          .reduce((s, r) => s + (Number(r.guests) || 1), 0),
      0
    );
    return {
      totalInvitations: items.length,
      activeCount,
      totalRsvps,
      confirmedHeadcount,
    };
  }, [items]);

  const visibleInvitations = useMemo(() => {
    if (statusFilter === 'all') return items;
    return items.filter((inv) => inv.status === statusFilter);
  }, [items, statusFilter]);

  const handleAddGuest = (e: React.FormEvent, invitationId: string) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    const record: RsvpGuestRecord = {
      id: `rsvp_${Date.now()}`,
      name: guestName.trim(),
      contact: guestContact.trim() || 'Guest entry',
      status: guestStatus,
      guests: Math.max(1, Math.min(10, Number(guestCount) || 1)),
      note: guestNote.trim(),
    };
    setItems((prev) =>
      prev.map((inv) => {
        if (inv.id !== invitationId) return inv;
        const nextList = [record, ...(inv.rsvpList || [])];
        onUpdateGuests?.(invitationId, nextList);
        return { ...inv, rsvpList: nextList };
      })
    );
    setGuestName('');
    setGuestContact('');
    setGuestCount(1);
    setGuestNote('');
  };

  return (
    <section className={`${styles.wrap} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.topHeader}>
        <div>
          <h2 className={styles.heading}>📊 Smileyyfy Invitations & Per-Invite RSVP Dashboard</h2>
          <p className={styles.sub}>
            {signedInUserName || signedInUserEmail
              ? `Signed in as ${signedInUserName || signedInUserEmail} • Active invitations & dedicated RSVP lists.`
              : 'Track active invitations and inspect each invitation’s dedicated RSVP guest list.'}
          </p>
        </div>
        <button type="button" className={styles.createBtn} onClick={() => onCreateNew?.()}>
          + New Invitation
        </button>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{metrics.activeCount}</span>
          <span className={styles.kpiLabel}>Active Invitations</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{metrics.totalInvitations}</span>
          <span className={styles.kpiLabel}>Total Invitations</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{metrics.totalRsvps}</span>
          <span className={styles.kpiLabel}>Total RSVP Entries</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{metrics.confirmedHeadcount}</span>
          <span className={styles.kpiLabel}>Confirmed Guests</span>
        </div>
      </div>

      <div className={styles.filterPills}>
        {(['all', 'active', 'draft', 'archived'] as const).map((st) => (
          <button
            key={st}
            type="button"
            className={`${styles.pill} ${statusFilter === st ? styles.activePill : ''}`}
            onClick={() => setStatusFilter(st)}
          >
            {st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.cardsStack}>
        {visibleInvitations.map((inv) => {
          const rsvps = inv.rsvpList || [];
          const attendingGuests = rsvps
            .filter((r) => r.status === 'attending')
            .reduce((sum, r) => sum + (Number(r.guests) || 1), 0);
          const isOpen = expandedId === inv.id;

          return (
            <article key={inv.id} className={styles.invCard}>
              <div className={styles.invMainRow}>
                <div className={styles.invInfo}>
                  <div className={styles.badgesRow}>
                    <span className={`${styles.statusBadge} ${styles[`st_${inv.status}`]}`}>{inv.status}</span>
                    <span className={styles.occBadge}>{inv.occasion}</span>
                    <span className={styles.rsvpCountBadge}>
                      📋 {rsvps.length} RSVPs • {attendingGuests} attending
                    </span>
                  </div>
                  <h3 className={styles.invTitle}>{inv.title}</h3>
                  <div className={styles.metaLine}>
                    📅 {inv.eventDate || 'Date TBD'} • 📍 {inv.venue || 'Venue TBD'}
                  </div>
                </div>

                <div className={styles.actionsCol}>
                  <button type="button" className={styles.actionPrimary} onClick={() => onEditInvitation?.(inv)}>
                    ✏️ Edit in Canvas
                  </button>
                  <button type="button" className={styles.actionGhost} onClick={() => onPreviewInvitation?.(inv)}>
                    👁️ Preview
                  </button>
                  <button
                    type="button"
                    className={styles.actionGhost}
                    onClick={() => setExpandedId((curr) => (curr === inv.id ? '' : inv.id))}
                  >
                    {isOpen ? '▲ Hide RSVP List' : `▼ RSVP List (${rsvps.length})`}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className={styles.rsvpPanel}>
                  <form className={styles.quickForm} onSubmit={(e) => handleAddGuest(e, inv.id)}>
                    <input
                      type="text"
                      required
                      placeholder="Guest name *"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Email or phone"
                      value={guestContact}
                      onChange={(e) => setGuestContact(e.target.value)}
                    />
                    <select
                      value={guestStatus}
                      onChange={(e) => setGuestStatus(e.target.value as 'attending' | 'maybe' | 'declined')}
                    >
                      <option value="attending">✅ Attending</option>
                      <option value="maybe">🤔 Maybe</option>
                      <option value="declined">❌ Declined</option>
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value) || 1)}
                      aria-label="Guest count"
                    />
                    <input
                      type="text"
                      placeholder="Dietary / note"
                      value={guestNote}
                      onChange={(e) => setGuestNote(e.target.value)}
                    />
                    <button type="submit" className={styles.addRsvpBtn}>
                      + Add RSVP
                    </button>
                  </form>

                  {rsvps.length === 0 ? (
                    <div className={styles.emptyRsvp}>No RSVPs recorded for this invitation yet.</div>
                  ) : (
                    <div className={styles.rsvpList}>
                      {rsvps.map((g) => (
                        <div key={g.id} className={styles.rsvpItem}>
                          <div>
                            <strong>{g.name}</strong> <span className={styles.plusTag}>+{g.guests}</span>
                            <div className={styles.rsvpSub}>
                              {g.contact}
                              {g.note ? ` • ${g.note}` : ''}
                            </div>
                          </div>
                          <span className={`${styles.guestSt} ${styles[`gst_${g.status}`]}`}>{g.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default InvitationDashboardOverview;
