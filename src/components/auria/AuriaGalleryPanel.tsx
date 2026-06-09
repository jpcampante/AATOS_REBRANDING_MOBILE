import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { auriaGalleryItems, AuriaGalleryCategory, AuriaGalleryItem } from '../../data/auriaMockData';
import {
  AuriaGalleryTab,
  AuriaGalleryTypeFilter,
  AuriaGalleryView,
  filterGalleryItems,
} from '../../features/auria/galleryLogic';
import { auriaTypography, liquidGlassTokens, useTheme } from '../../theme';
import { AuriaIcon, AURIA_ICON_SIZE, AURIA_ICON_STROKE_NAV } from '../icons';
import {
  AuriaEmptyState,
  AuriaPanelCard,
  AuriaPanelHeader,
  AuriaPanelScroll,
  AuriaSearchField,
  AuriaSegmentedControl,
} from './AuriaPanelShared';

const GALLERY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'files', label: 'Files' },
] as const;

const TYPE_FILTERS: AuriaGalleryCategory[] = ['PDF', 'Document', 'Spreadsheet', 'Image'];

export function AuriaGalleryPanel() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [tab, setTab] = useState<AuriaGalleryTab>('all');
  const [view, setView] = useState<AuriaGalleryView>('grid');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AuriaGalleryTypeFilter>(null);

  const items = useMemo(
    () => filterGalleryItems(auriaGalleryItems, { tab, query, typeFilter }),
    [query, tab, typeFilter],
  );

  return (
    <AuriaPanelScroll>
      <AuriaPanelHeader
        title="Gallery"
        subtitle="Files and images created across your workspace."
        actions={<GalleryViewToggle view={view} onChange={setView} />}
      />
      <AuriaSearchField value={query} onChangeText={setQuery} placeholder="Search library" />
      <AuriaSegmentedControl value={tab} items={GALLERY_TABS} onChange={setTab} />

      <View style={styles.typeRow}>
        {TYPE_FILTERS.map((type) => {
          const active = typeFilter === type;
          return (
            <Pressable
              key={type}
              style={[styles.typeChip, active && styles.typeChipActive]}
              onPress={() => setTypeFilter(active ? null : type)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{type}</Text>
            </Pressable>
          );
        })}
      </View>

      {items.length === 0 ? (
        <AuriaEmptyState
          title="No files found"
          message="Try a different search or clear the active filters."
        />
      ) : view === 'grid' ? (
        <View style={styles.grid}>
          {items.map((item) => (
            <GalleryGridCard key={item.id} item={item} />
          ))}
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <GalleryListRow key={item.id} item={item} />
          ))}
        </View>
      )}
    </AuriaPanelScroll>
  );
}

function GalleryViewToggle({
  view,
  onChange,
}: {
  view: AuriaGalleryView;
  onChange: (view: AuriaGalleryView) => void;
}) {
  const { ds, theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.viewToggle}>
      {(['grid', 'list'] as const).map((value) => {
        const active = view === value;
        return (
          <Pressable
            key={value}
            onPress={() => onChange(value)}
            accessibilityRole="button"
            accessibilityLabel={`${value === 'grid' ? 'Grid' : 'List'} view`}
            accessibilityState={{ selected: active }}
            style={[styles.viewButton, active && styles.viewButtonActive]}
          >
            <AuriaIcon
              name={value}
              size={AURIA_ICON_SIZE.sm}
              color={active ? ds.gray900 : ds.gray500}
              strokeWidth={AURIA_ICON_STROKE_NAV}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

function GalleryGridCard({ item }: { item: AuriaGalleryItem }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.gridItem}>
      <AuriaPanelCard style={styles.gridCard}>
        <View style={[styles.thumbnail, { backgroundColor: item.accent }]}>
          <Text style={[styles.typeBadge, { color: item.text }]}>{item.type}</Text>
        </View>
        <Text style={styles.fileName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.fileMeta} numberOfLines={1}>
          {item.sizeLabel} · {item.modifiedLabel}
        </Text>
      </AuriaPanelCard>
    </View>
  );
}

function GalleryListRow({ item }: { item: AuriaGalleryItem }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <AuriaPanelCard style={styles.listCard}>
      <View style={[styles.listThumbnail, { backgroundColor: item.accent }]}>
        <Text style={[styles.listType, { color: item.text }]}>{item.type}</Text>
      </View>
      <View style={styles.listCopy}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.fileMeta} numberOfLines={1}>
          {item.source} · {item.sizeLabel}
        </Text>
      </View>
      <AuriaIcon name="moreHorizontal" tertiary />
    </AuriaPanelCard>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const glass = liquidGlassTokens(theme);
  return StyleSheet.create({
    viewToggle: {
      flexDirection: 'row',
      borderRadius: theme.radius.pill,
      backgroundColor: glass.fill,
      borderWidth: 1,
      borderColor: glass.borderSubtle,
      padding: 3,
      gap: 2,
    },
    viewButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
    },
    viewButtonActive: {
      backgroundColor: glass.fillStrong,
    },
    typeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
    },
    typeChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: theme.radius.pill,
      borderWidth: 1,
      borderColor: glass.borderSubtle,
      backgroundColor: 'transparent',
    },
    typeChipActive: {
      backgroundColor: glass.fillStrong,
      borderColor: glass.border,
    },
    typeChipText: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 12,
      fontWeight: theme.typography.fontWeight.medium,
    },
    typeChipTextActive: {
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    gridItem: {
      width: '48%',
      flexGrow: 1,
    },
    gridCard: {
      gap: 9,
      minHeight: 166,
    },
    thumbnail: {
      height: 92,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    typeBadge: {
      ...auriaTypography.label,
      fontSize: 12,
      fontWeight: theme.typography.fontWeight.extrabold,
    },
    fileName: {
      ...auriaTypography.body,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    fileMeta: {
      ...auriaTypography.body,
      fontSize: 11,
      color: theme.colors.textTertiary,
    },
    list: {
      gap: 8,
    },
    listCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    listThumbnail: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listType: {
      ...auriaTypography.label,
      fontSize: 9,
      fontWeight: theme.typography.fontWeight.bold,
    },
    listCopy: {
      flex: 1,
      gap: 4,
    },
  });
}
