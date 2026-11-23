interface RsvpGuestRecord {
  id: string;
  name: string;
  contact: string;
  status: 'attending' | 'maybe' | 'declined';
  guests: number;
  note?: string;
}

export type { RsvpGuestRecord as default };
