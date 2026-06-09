import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  auriaNewsArticles,
  AuriaNewsArticle,
  AuriaNewsTopic,
} from '../../data/auriaMockData';
import {
  AuriaNewsTab,
  buildNewsFeed,
  partitionNewsFeed,
} from '../../features/auria/newsLogic';
import { auriaTypography, liquidGlassTokens, useTheme } from '../../theme';
import { AuriaIcon, AURIA_ICON_SIZE, AURIA_ICON_STROKE_NAV } from '../icons';
import {
  AuriaEmptyState,
  AuriaPanelCard,
  AuriaPanelHeader,
  AuriaPanelScroll,
  AuriaSegmentedControl,
} from './AuriaPanelShared';

const NEWS_TABS = [
  { id: 'for-you', label: 'For You' },
  { id: 'top', label: 'Top' },
  { id: 'topics', label: 'Topics' },
] as const;

const NEWS_TOPICS: AuriaNewsTopic[] = ['Business', 'Technology', 'Markets', 'World'];

export function AuriaNewsPanel() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [tab, setTab] = useState<AuriaNewsTab>('for-you');
  const [selectedTopic, setSelectedTopic] = useState<AuriaNewsTopic | null>('World');
  const [openArticle, setOpenArticle] = useState<AuriaNewsArticle | null>(null);

  const feed = useMemo(
    () => buildNewsFeed(auriaNewsArticles, { tab, selectedTopic }),
    [selectedTopic, tab],
  );
  const { featured, remaining } = partitionNewsFeed(feed);

  if (openArticle) {
    return (
      <AuriaPanelScroll>
        <Pressable
          style={styles.backButton}
          onPress={() => setOpenArticle(null)}
          accessibilityRole="button"
        >
          <AuriaIcon
            name="arrowLeft"
            size={AURIA_ICON_SIZE.sm}
            strokeWidth={AURIA_ICON_STROKE_NAV}
          />
          <Text style={styles.backText}>Back to News</Text>
        </Pressable>
        <View style={[styles.detailHero, { backgroundColor: openArticle.accent }]} />
        <Text style={styles.detailTitle}>{openArticle.title}</Text>
        <Text style={styles.detailMeta}>
          {openArticle.sources} sources {'\u00B7'} {openArticle.publishedAgo}
        </Text>
        <Text style={styles.detailSummary}>{openArticle.summary}</Text>
        <View style={styles.topicRow}>
          {openArticle.topics.map((topic) => (
            <View key={topic} style={styles.topicChip}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
      </AuriaPanelScroll>
    );
  }

  return (
    <AuriaPanelScroll>
      <AuriaPanelHeader title="News" subtitle="A focused briefing for your workspace." />
      <AuriaSegmentedControl value={tab} items={NEWS_TABS} onChange={setTab} />

      {tab === 'topics' ? (
        <View style={styles.topicRow}>
          {NEWS_TOPICS.map((topic) => {
            const active = topic === selectedTopic;
            return (
              <Pressable
                key={topic}
                style={[styles.topicChip, active && styles.topicChipActive]}
                onPress={() => setSelectedTopic(topic)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.topicText, active && styles.topicTextActive]}>{topic}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {!featured ? (
        <AuriaEmptyState
          title="No stories available"
          message="Choose another topic to continue reading."
        />
      ) : (
        <>
          <FeaturedArticle article={featured} onPress={() => setOpenArticle(featured)} />
          <View style={styles.articleList}>
            {remaining.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
                onPress={() => setOpenArticle(article)}
              />
            ))}
          </View>
        </>
      )}
    </AuriaPanelScroll>
  );
}

function FeaturedArticle({
  article,
  onPress,
}: {
  article: AuriaNewsArticle;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <AuriaPanelCard onPress={onPress} style={styles.featuredCard}>
      <View style={[styles.featuredImage, { backgroundColor: article.accent }]}>
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>Featured</Text>
        </View>
      </View>
      <Text style={styles.featuredTitle}>{article.title}</Text>
      <Text style={styles.summary} numberOfLines={3}>
        {article.summary}
      </Text>
      <Text style={styles.meta}>
        {article.sources} sources {'\u00B7'} {article.publishedAgo}
      </Text>
    </AuriaPanelCard>
  );
}

function ArticleRow({
  article,
  onPress,
}: {
  article: AuriaNewsArticle;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <AuriaPanelCard onPress={onPress} style={styles.articleRow}>
      <View style={[styles.articleImage, { backgroundColor: article.accent }]} />
      <View style={styles.articleCopy}>
        <Text style={styles.articleTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.rowMeta}>
          {article.sources} sources {'\u00B7'} {article.publishedAgo}
        </Text>
      </View>
    </AuriaPanelCard>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const glass = liquidGlassTokens(theme);
  return StyleSheet.create({
    topicRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
    },
    topicChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: theme.radius.pill,
      borderWidth: 1,
      borderColor: glass.borderSubtle,
      backgroundColor: glass.fill,
    },
    topicChipActive: {
      backgroundColor: glass.fillStrong,
      borderColor: glass.border,
    },
    topicText: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 12,
      fontWeight: theme.typography.fontWeight.medium,
    },
    topicTextActive: {
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    featuredCard: {
      padding: 0,
      overflow: 'hidden',
      gap: 0,
    },
    featuredImage: {
      height: 142,
      padding: 12,
      justifyContent: 'flex-end',
    },
    featuredBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.radius.pill,
      backgroundColor: glass.fillStrong,
    },
    featuredBadgeText: {
      ...auriaTypography.label,
      color: theme.colors.text,
      fontSize: 11,
      fontWeight: theme.typography.fontWeight.bold,
    },
    featuredTitle: {
      ...auriaTypography.title,
      color: theme.colors.text,
      fontSize: 17,
      lineHeight: 23,
      fontWeight: theme.typography.fontWeight.bold,
      marginHorizontal: 14,
      marginTop: 13,
    },
    summary: {
      ...auriaTypography.body,
      color: theme.colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      marginHorizontal: 14,
      marginTop: 6,
    },
    meta: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 11,
      fontWeight: theme.typography.fontWeight.medium,
      margin: 14,
      marginTop: 8,
    },
    rowMeta: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 11,
      fontWeight: theme.typography.fontWeight.medium,
      marginTop: 7,
    },
    articleList: {
      gap: 8,
    },
    articleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    articleImage: {
      width: 76,
      height: 76,
      borderRadius: theme.radius.md,
    },
    articleCopy: {
      flex: 1,
    },
    articleTitle: {
      ...auriaTypography.body,
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 19,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    backButton: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 7,
    },
    backText: {
      ...auriaTypography.body,
      color: theme.colors.textSecondary,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    detailHero: {
      height: 180,
      borderRadius: theme.radius.card,
    },
    detailTitle: {
      ...auriaTypography.title,
      color: theme.colors.text,
      fontSize: 24,
      lineHeight: 31,
      fontWeight: theme.typography.fontWeight.bold,
    },
    detailMeta: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 12,
    },
    detailSummary: {
      ...auriaTypography.body,
      color: theme.colors.textSecondary,
      fontSize: 15,
      lineHeight: 23,
    },
  });
}
