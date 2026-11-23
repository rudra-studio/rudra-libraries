import type RsvpGuestRecord from './RsvpGuestRecord';

interface SmileyyfyDashboardInvitation {
  id: string;
  title: string;
  occasion: string;
  eventDate: string;
  venue: string;
  status: 'active' | 'draft' | 'archived';
  templateId?: string;
  rsvpList: RsvpGuestRecord[];
}

export type { SmileyyfyDashboardInvitation as default };
