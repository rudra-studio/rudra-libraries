export interface OccasionTemplateItem {
  id: string;
  title: string;
  category: 'Weddings & Events' | 'Romance' | 'Milestones';
  emoji: string;
  description: string;
  tags: string[];
  routeHint: string;
}
