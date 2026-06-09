import type { AuriaNewsArticle, AuriaNewsTopic } from '../../data/auriaMockData';

export type AuriaNewsTab = 'for-you' | 'top' | 'topics';

export function buildNewsFeed(
  articles: readonly AuriaNewsArticle[],
  options: {
    tab: AuriaNewsTab;
    selectedTopic: AuriaNewsTopic | null;
  },
): AuriaNewsArticle[] {
  let feed = [...articles];

  if (options.tab === 'topics' && options.selectedTopic) {
    feed = feed.filter((article) => article.topics.includes(options.selectedTopic!));
  }

  if (options.tab === 'top') {
    return feed.sort((a, b) => b.sources - a.sources);
  }

  return feed.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.sources - a.sources);
}

export function partitionNewsFeed(articles: readonly AuriaNewsArticle[]) {
  return {
    featured: articles[0] ?? null,
    remaining: articles.slice(1),
  };
}
