import { useMemo, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AURIA_CONTENT_HORIZONTAL_INSET, AURIA_PANEL_SCROLL_END_PADDING } from './auriaLayout';
import {
  AuriaIcon,
  AURIA_ICON_SIZE,
  AURIA_ICON_STROKE_NAV,
} from '../icons';
import {
  auriaGalleryItems,
  auriaNewsArticles,
  auriaProjects,
  auriaRecentSearches,
  auriaSearchResults,
  AuriaProject,
} from '../../data/auriaMockData';
import { auriaGlassBorder, auriaGlassElevation, auriaGlassElevationWeb, auriaGlassTokens } from './auriaGlass';
import { useTheme } from '../../theme';

function usePanelStyles() {
  const { ds, theme } = useTheme();

  return useMemo(() => {
    const glass = auriaGlassTokens(theme.mode);
    const rim = auriaGlassBorder(theme.mode);

    const card = {
      backgroundColor: glass.fill,
      borderRadius: 16,
      padding: 14,
      ...rim,
      ...glass.webBlur,
      ...auriaGlassElevation(theme.mode, 'card'),
      ...auriaGlassElevationWeb(theme.mode, 'card'),
    } as const;

    return {
      card,
      styles: StyleSheet.create({
        scroll: {
          paddingHorizontal: AURIA_CONTENT_HORIZONTAL_INSET,
          paddingTop: 8,
          paddingBottom: AURIA_PANEL_SCROLL_END_PADDING,
          gap: 12,
        },
        panelTitle: {
          fontSize: 26,
          fontWeight: theme.typography.fontWeight.bold,
          color: ds.gray900,
          letterSpacing: -0.5,
        },
        panelSubtitle: {
          fontSize: 14,
          lineHeight: 20,
          color: ds.gray600,
          marginTop: -4,
        },
        sectionLabel: {
          fontSize: 12,
          fontWeight: theme.typography.fontWeight.bold,
          letterSpacing: theme.typography.letterSpacing.label,
          textTransform: 'uppercase',
          color: ds.gray500,
          marginTop: 8,
        },
        rowCard: {
          gap: 4,
        },
        rowTitle: {
          fontSize: 15,
          fontWeight: theme.typography.fontWeight.semibold,
          color: ds.gray900,
        },
        rowMeta: {
          fontSize: 13,
          color: ds.gray500,
        },
        newsCard: {
          overflow: 'hidden',
          padding: 0,
        },
        newsImage: {
          height: 140,
          justifyContent: 'flex-end',
          padding: 12,
        },
        newsFeatured: {
          alignSelf: 'flex-start',
          backgroundColor: 'rgba(255,255,255,0.85)',
          color: ds.gray900,
          fontSize: 11,
          fontWeight: theme.typography.fontWeight.bold,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
          overflow: 'hidden',
        },
        newsBody: {
          padding: 14,
          gap: 6,
        },
        newsTitle: {
          fontSize: 16,
          lineHeight: 22,
          fontWeight: theme.typography.fontWeight.bold,
          color: ds.gray900,
        },
        newsSummary: {
          fontSize: 14,
          lineHeight: 20,
          color: ds.gray600,
        },
        newsMeta: {
          fontSize: 12,
          color: ds.gray500,
          fontWeight: theme.typography.fontWeight.semibold,
        },
        chipsRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
        },
        filterChip: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          backgroundColor: glass.fill,
          ...auriaGlassBorder(theme.mode, true),
          ...glass.webBlur,
        },
        filterChipActive: {
          backgroundColor: ds.btnPrimary,
        },
        filterChipText: {
          fontSize: 13,
          fontWeight: theme.typography.fontWeight.semibold,
          color: ds.gray700,
        },
        filterChipTextActive: {
          color: ds.white,
        },
        galleryGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
        },
        galleryCard: {
          width: '48%',
          flexGrow: 1,
          gap: 8,
        },
        galleryThumb: {
          height: 88,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: glass.fillStrong,
          ...auriaGlassBorder(theme.mode, true),
        },
        galleryType: {
          fontSize: 12,
          fontWeight: theme.typography.fontWeight.extrabold,
        },
        galleryName: {
          fontSize: 13,
          lineHeight: 18,
          color: ds.gray800,
          fontWeight: theme.typography.fontWeight.semibold,
        },
        searchBar: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: glass.inputFill,
          ...auriaGlassBorder(theme.mode, true),
          ...glass.inputWebBlur,
          ...auriaGlassElevation(theme.mode, 'input'),
          ...auriaGlassElevationWeb(theme.mode, 'input'),
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 10,
        },
        searchInput: {
          flex: 1,
          fontSize: 15,
          color: ds.gray900,
          backgroundColor: 'transparent',
          ...(Platform.OS === 'web'
            ? ({ outlineWidth: 0, outlineStyle: 'none', boxShadow: 'none' } as object)
            : null),
        },
        projectCard: {
          flexDirection: 'row',
          gap: 12,
          alignItems: 'flex-start',
        },
        projectIcon: {
          width: 44,
          height: 44,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
        },
        projectEmoji: {
          color: ds.white,
          fontSize: 18,
          fontWeight: theme.typography.fontWeight.extrabold,
        },
        projectCopy: {
          flex: 1,
          gap: 4,
        },
        projectOwner: {
          fontSize: 12,
          color: ds.gray500,
        },
        newProjectButton: {
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          alignItems: 'center',
          paddingVertical: 14,
          borderRadius: 14,
          backgroundColor: glass.fill,
          ...rim,
          ...glass.webBlur,
          marginTop: 4,
        },
        newProjectText: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeight.bold,
          color: ds.gray900,
        },
      }),
    };
  }, [ds, theme]);
}

export function AuriaNewsPanel() {
  const { card, styles } = usePanelStyles();

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.panelTitle}>News</Text>
      <Text style={styles.panelSubtitle}>Curated briefing for your workspace.</Text>

      {auriaNewsArticles.map((article, index) => (
        <Pressable key={article.id} style={[styles.newsCard, card]}>
          <View style={[styles.newsImage, { backgroundColor: article.accent }]}>
            {index === 0 ? <Text style={styles.newsFeatured}>Featured</Text> : null}
          </View>
          <View style={styles.newsBody}>
            <Text style={styles.newsTitle}>{article.title}</Text>
            {'summary' in article && article.summary ? (
              <Text style={styles.newsSummary}>{article.summary}</Text>
            ) : null}
            <Text style={styles.newsMeta}>
              {article.sources} sources · {article.publishedAgo}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function AuriaGalleryPanel() {
  const { card, styles } = usePanelStyles();
  const [tab, setTab] = useState<'all' | 'images' | 'files'>('all');
  const items = auriaGalleryItems.filter((item) => {
    if (tab === 'all') return true;
    if (tab === 'images') return item.type === 'Image';
    return item.type !== 'Image';
  });

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.panelTitle}>Gallery</Text>
      <View style={styles.chipsRow}>
        {(['all', 'images', 'files'] as const).map((value) => (
          <Pressable
            key={value}
            style={[styles.filterChip, tab === value && styles.filterChipActive]}
            onPress={() => setTab(value)}
          >
            <Text style={[styles.filterChipText, tab === value && styles.filterChipTextActive]}>
              {value === 'all' ? 'All' : value === 'images' ? 'Images' : 'Files'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.galleryGrid}>
        {items.map((item) => (
          <Pressable key={item.id} style={[styles.galleryCard, card]}>
            <View style={[styles.galleryThumb, { backgroundColor: item.accent }]}>
              <Text style={[styles.galleryType, { color: item.text }]}>{item.type}</Text>
            </View>
            <Text style={styles.galleryName} numberOfLines={2}>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

export function AuriaSearchPanel() {
  const { ds } = useTheme();
  const { card, styles } = usePanelStyles();
  const [query, setQuery] = useState('');
  const hasQuery = query.trim().length > 0;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <Text style={styles.panelTitle}>Search</Text>
      <View style={styles.searchBar}>
        <AuriaIcon
          name="search"
          size={AURIA_ICON_SIZE.sm}
          color={ds.gray500}
          strokeWidth={AURIA_ICON_STROKE_NAV}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search chats, projects, files…"
          placeholderTextColor={ds.gray400}
          style={styles.searchInput}
          returnKeyType="search"
          enablesReturnKeyAutomatically
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </View>

      {!hasQuery ? (
        <>
          <Text style={styles.sectionLabel}>Recent searches</Text>
          {auriaRecentSearches.map((term) => (
            <Pressable key={term} style={[styles.rowCard, card]} onPress={() => setQuery(term)}>
              <Text style={styles.rowTitle}>{term}</Text>
            </Pressable>
          ))}
        </>
      ) : (
        <>
          <Text style={styles.sectionLabel}>Chats</Text>
          {auriaSearchResults.chats.map((row) => (
            <View key={row.id} style={[styles.rowCard, card]}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowMeta}>{row.preview}</Text>
            </View>
          ))}
          <Text style={styles.sectionLabel}>Projects</Text>
          {auriaSearchResults.projects.map((row) => (
            <View key={row.id} style={[styles.rowCard, card]}>
              <Text style={styles.rowTitle}>{row.name}</Text>
              <Text style={styles.rowMeta}>{row.meta}</Text>
            </View>
          ))}
          <Text style={styles.sectionLabel}>Files</Text>
          {auriaSearchResults.files.map((row) => (
            <View key={row.id} style={[styles.rowCard, card]}>
              <Text style={styles.rowTitle}>{row.name}</Text>
              <Text style={styles.rowMeta}>{row.meta}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

export function AuriaProjectsPanel({
  projects = auriaProjects,
  onCreateProject,
}: {
  projects?: AuriaProject[];
  onCreateProject?: () => void;
}) {
  const { card, styles } = usePanelStyles();
  const [tab, setTab] = useState<'team' | 'shared'>('team');
  const items = projects.filter((p) =>
    tab === 'team' ? p.visibility === 'Team' : p.visibility === 'Shared',
  );

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.panelTitle}>Projects</Text>
      <View style={styles.chipsRow}>
        <Pressable
          style={[styles.filterChip, tab === 'team' && styles.filterChipActive]}
          onPress={() => setTab('team')}
        >
          <Text style={[styles.filterChipText, tab === 'team' && styles.filterChipTextActive]}>
            Team
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, tab === 'shared' && styles.filterChipActive]}
          onPress={() => setTab('shared')}
        >
          <Text style={[styles.filterChipText, tab === 'shared' && styles.filterChipTextActive]}>
            Shared
          </Text>
        </Pressable>
      </View>

      {items.map((project) => (
        <Pressable key={project.id} style={[styles.projectCard, card]}>
          <View style={[styles.projectIcon, { backgroundColor: project.accent }]}>
            <Text style={styles.projectEmoji}>{project.emoji}</Text>
          </View>
          <View style={styles.projectCopy}>
            <Text style={styles.rowTitle}>{project.name}</Text>
            <Text style={styles.rowMeta}>
              {project.fileCount} files · {project.chatCount} chats · {project.updatedLabel}
            </Text>
            <Text style={styles.projectOwner}>{project.owner}</Text>
          </View>
        </Pressable>
      ))}

      <Pressable style={styles.newProjectButton} onPress={onCreateProject}>
        <AuriaIcon
          name="folderPlus"
          size={AURIA_ICON_SIZE.sm}
          strokeWidth={AURIA_ICON_STROKE_NAV}
        />
        <Text style={styles.newProjectText}>New project</Text>
      </Pressable>
    </ScrollView>
  );
}
