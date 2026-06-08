export const dauSeries = [
  { month: 'MAY', value: 320 },
  { month: 'JUN', value: 380 },
  { month: 'JUL', value: 420 },
  { month: 'AUG', value: 480 },
  { month: 'SEP', value: 580 },
  { month: 'OCT', value: 620 },
  { month: 'NOV', value: 540 },
  { month: 'DEC', value: 490 },
  { month: 'JAN', value: 510 },
  { month: 'FEB', value: 620 },
  { month: 'MAR', value: 980 },
  { month: 'APR', value: 680 },
] as const;

export const activitySeries = [
  { month: 'MAY', value: 35 },
  { month: 'JUN', value: 42 },
  { month: 'JUL', value: 38 },
  { month: 'AUG', value: 55 },
  { month: 'SEP', value: 48 },
  { month: 'OCT', value: 60 },
] as const;

export const companyDashboard = {
  id: 'company',
  name: 'Company Overview',
  subtitle: 'Org-wide health',
  team: 'Legal',
} as const;

export const companyKpis = [
  { label: 'Tasks completed', value: '159', delta: '+12%' },
  { label: 'AI interactions', value: '240', delta: '+18%' },
  { label: 'Emails processed', value: '320', delta: '-8%' },
  { label: 'Meetings this week', value: '24', delta: '+3%' },
] as const;

export const companyInsight = {
  title: 'This week, productivity is up 12% across the org',
  body:
    'Tasks completed grew from 142 to 159 while AI interactions doubled in the Sales team. Email backlog shrunk to 28 items.',
  actions: ['Open Operations', 'Generate full report'],
} as const;

export const heroSuggestionChips = [
  'Display as table of users',
  'Activity in Sales team',
  'Show course progress',
] as const;

export const heroPlaceholder = 'Tell me about the activity in the Legal team';
