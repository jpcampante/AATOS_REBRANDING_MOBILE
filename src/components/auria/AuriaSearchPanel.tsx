import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { auriaRecentSearches, auriaSearchResults } from '../../data/auriaMockData';
import { auriaTypography, useTheme } from '../../theme';
import {
  AuriaEmptyState,
  AuriaPanelCard,
  AuriaPanelHeader,
  AuriaPanelScroll,
  AuriaSearchField,
} from './AuriaPanelShared';

type SearchRow = { id: string; title: string; meta: string };

export function AuriaSearchPanel() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const sections = useMemo(() => {
    const filter = (rows: readonly SearchRow[]) =>
      normalizedQuery
        ? rows.filter((row) => `${row.title} ${row.meta}`.toLowerCase().includes(normalizedQuery))
        : [];

    return [
      {
        title: 'Chats',
        rows: filter(
          auriaSearchResults.chats.map((row) => ({
            id: row.id,
            title: row.title,
            meta: row.preview,
          })),
        ),
      },
      {
        title: 'Projects',
        rows: filter(
          auriaSearchResults.projects.map((row) => ({
            id: row.id,
            title: row.name,
            meta: row.meta,
          })),
        ),
      },
      {
        title: 'Files',
        rows: filter(
          auriaSearchResults.files.map((row) => ({
            id: row.id,
            title: row.name,
            meta: row.meta,
          })),
        ),
      },
    ];
  }, [normalizedQuery]);

  const resultCount = sections.reduce((total, section) => total + section.rows.length, 0);

  return (
    <AuriaPanelScroll>
      <AuriaPanelHeader title="Search" subtitle="Find chats, projects, and files." />
      <AuriaSearchField value={query} onChangeText={setQuery} placeholder="Search workspace" />

      {!normalizedQuery ? (
        <>
          <Text style={styles.sectionLabel}>Recent searches</Text>
          {auriaRecentSearches.map((term) => (
            <AuriaPanelCard key={term} onPress={() => setQuery(term)}>
              <Text style={styles.rowTitle}>{term}</Text>
            </AuriaPanelCard>
          ))}
        </>
      ) : resultCount === 0 ? (
        <AuriaEmptyState
          title="No results found"
          message={`Nothing matches "${query.trim()}". Try a broader search.`}
        />
      ) : (
        sections.map((section) =>
          section.rows.length ? (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionLabel}>{section.title}</Text>
              {section.rows.map((row) => (
                <AuriaPanelCard key={row.id}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  <Text style={styles.rowMeta}>{row.meta}</Text>
                </AuriaPanelCard>
              ))}
            </View>
          ) : null,
        )
      )}
    </AuriaPanelScroll>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    section: {
      gap: 8,
    },
    sectionLabel: {
      ...auriaTypography.label,
      color: theme.colors.textTertiary,
      fontSize: 11,
      fontWeight: theme.typography.fontWeight.bold,
      textTransform: 'uppercase',
      marginTop: 4,
    },
    rowTitle: {
      ...auriaTypography.body,
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    rowMeta: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 12,
      marginTop: 4,
    },
  });
}
