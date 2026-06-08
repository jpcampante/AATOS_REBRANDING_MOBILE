export const auriaWorkspaceName = 'New workspace';

export const auriaWelcomeSuggestions = [
  'Create prioritized task list',
  'Generate report summary',
  'Structure presentation outline',
] as const;

export const auriaWelcomeSuggestionPool = [
  'Create prioritized task list',
  'Generate report summary',
  'Structure presentation outline',
  'Summarize last meeting notes',
  'Draft follow-up email to client',
  'Plan sprint priorities for next week',
  'Review contract key terms',
  'Outline Q3 growth strategy',
] as const;

export const auriaSidebarTopItems = [
  { id: 'gallery' as const, label: 'Gallery', icon: 'photo' as const },
  { id: 'news' as const, label: 'News', icon: 'newspaper' as const },
  { id: 'more' as const, label: 'More', icon: 'moreHorizontal' as const },
];

export type AuriaPanel = 'chat' | 'news' | 'gallery' | 'search' | 'projects';

export type AuriaTab = AuriaPanel;

export type AuriaProjectVisibility = 'Team' | 'Shared';

export type AuriaProject = {
  id: string;
  name: string;
  owner: string;
  emoji: string;
  accent: string;
  visibility: AuriaProjectVisibility;
  updatedLabel: string;
  fileCount: number;
  chatCount: number;
};

export type AuriaSidebarProjectRow = {
  id: string;
  name: string;
  kind: 'new' | 'folder' | 'more';
};

export const PROJECT_ACCENT_PALETTE = ['#1565C0', '#2E7D32', '#E65100', '#00838F', '#6A1B9A'] as const;

export const auriaWelcomeName = 'Marta';
export const auriaProfileInitials = 'MA';

export const auriaNewsArticles = [
  {
    id: '1',
    title: 'Germany, France and the UK outline plan to engage Putin in Ukraine negotiations',
    summary:
      'European leaders are discussing a joint roadmap to reopen talks with Moscow, focused on security guarantees and a partial ceasefire.',
    sources: 59,
    publishedAgo: '1 hour ago',
    accent: '#5B7C99',
  },
  {
    id: '2',
    title: 'Ukraine strikes oil terminal near Saint Petersburg',
    sources: 43,
    publishedAgo: '2 hours ago',
    accent: '#6B7280',
  },
  {
    id: '3',
    title: 'Iranian drone attack hits airport in Kuwait',
    sources: 38,
    publishedAgo: '3 hours ago',
    accent: '#78716C',
  },
  {
    id: '4',
    title: 'Bolivian defense minister resigns after political crisis',
    sources: 29,
    publishedAgo: '4 hours ago',
    accent: '#57534E',
  },
] as const;

export const auriaGalleryItems = [
  { id: 'g1', name: 'Q1 Strategy Brief.pdf', type: 'PDF', accent: '#FEE2E2', text: '#B91C1C' },
  { id: 'g2', name: 'Team photo — Lisbon offsite.jpg', type: 'Image', accent: '#DBEAFE', text: '#1D4ED8' },
  { id: 'g3', name: 'Customer interview notes.md', type: 'Document', accent: '#F3F4F6', text: '#374151' },
  { id: 'g4', name: 'Pipeline export.csv', type: 'Data', accent: '#ECFDF5', text: '#047857' },
  { id: 'g5', name: 'Brand moodboard.png', type: 'Image', accent: '#FEF3C7', text: '#B45309' },
  { id: 'g6', name: 'Board memo.pdf', type: 'PDF', accent: '#FEE2E2', text: '#B91C1C' },
] as const;

export const auriaRecentSearches = [
  'Legal contract review',
  'Q2 pipeline summary',
  'Customer onboarding deck',
] as const;

export const auriaSearchResults = {
  chats: [
    { id: 'c1', title: 'Summarize Q2 pipeline', preview: 'Auria · yesterday' },
    { id: 'c2', title: 'Draft customer follow-up', preview: 'Auria · 2 days ago' },
  ],
  projects: [
    { id: 'f-finance', name: 'Finance team', meta: '3 files · 2 chats' },
    { id: 'f-sales', name: 'Sales team', meta: '5 files · 4 chats' },
  ],
  files: [
    { id: 'file1', name: 'Board memo.pdf', meta: 'Updated 1h ago' },
    { id: 'file2', name: 'Team photo.jpg', meta: 'Updated yesterday' },
  ],
} as const;

export const auriaProjects: AuriaProject[] = [
  {
    id: 'f-finance',
    name: 'Finance team',
    owner: 'Finance team',
    emoji: '$',
    accent: '#1565C0',
    visibility: 'Team' as const,
    updatedLabel: 'Updated 2h ago',
    fileCount: 8,
    chatCount: 3,
  },
  {
    id: 'f-projects',
    name: 'Delivery team',
    owner: 'Delivery team',
    emoji: 'P',
    accent: '#2E7D32',
    visibility: 'Team' as const,
    updatedLabel: 'Updated yesterday',
    fileCount: 12,
    chatCount: 5,
  },
  {
    id: 'f-sales',
    name: 'Sales team',
    owner: 'Sales team',
    emoji: 'S',
    accent: '#E65100',
    visibility: 'Team' as const,
    updatedLabel: 'Updated 4h ago',
    fileCount: 6,
    chatCount: 2,
  },
  {
    id: 'f-legal',
    name: 'Legal team',
    owner: 'Legal team',
    emoji: 'L',
    accent: '#00838F',
    visibility: 'Shared' as const,
    updatedLabel: 'Updated last week',
    fileCount: 4,
    chatCount: 1,
  },
] as const;

export const auriaConversations = [
  { id: 'h1', title: 'Refação Termos de Serviço', pinned: true },
  { id: 'h2', title: 'Summarize Q2 pipeline', pinned: false },
  { id: 'h3', title: 'Draft board update', pinned: false },
  { id: 'h4', title: 'Customer onboarding plan', pinned: false },
  { id: 'h5', title: 'Legal contract review', pinned: false },
] as const;

export const auriaSidebarProjects: AuriaSidebarProjectRow[] = [
  { id: 'new', name: 'New project', kind: 'new' as const },
  { id: 'f-finance', name: 'Finance team', kind: 'folder' as const },
  { id: 'f-sales', name: 'Sales team', kind: 'folder' as const },
  { id: 'f-legal', name: 'Legal team', kind: 'folder' as const },
  { id: 'more', name: 'See more', kind: 'more' as const },
] as const;
