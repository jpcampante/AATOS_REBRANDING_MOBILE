import { useMemo, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { auriaGalleryItems, AuriaGalleryItem } from '../../data/auriaMockData';
import {
  AuriaGalleryTab,
  AuriaGalleryView,
  filterGalleryItems,
} from '../../features/auria/galleryLogic';
import { auriaTypography, useTheme } from '../../theme';
import { AuriaIcon, AURIA_ICON_SIZE, AURIA_ICON_STROKE_NAV } from '../icons';
import { AuriaEmptyState, AuriaPanelScroll } from './AuriaPanelShared';

const TABS: Array<{ id: AuriaGalleryTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'files', label: 'Files' },
];

export function AuriaGalleryPanel() {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [tab, setTab] = useState<AuriaGalleryTab>('all');
  const [view, setView] = useState<AuriaGalleryView>('grid');
  const [query, setQuery] = useState('');
  const [uploadedItems, setUploadedItems] = useState<AuriaGalleryItem[]>([]);

  const items = useMemo(
    () => filterGalleryItems([...uploadedItems, ...auriaGalleryItems], { tab, query, typeFilter: null }),
    [query, tab, uploadedItems],
  );
  const columns = width >= 960 ? 4 : width >= 680 ? 3 : 2;
  const cardWidth = `${100 / columns - 1.6}%` as const;

  const upload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true, copyToCacheDirectory: true });
    if (result.canceled) return;
    setUploadedItems((current) => [
      ...result.assets.map((asset, index) => ({
        id: `upload-${asset.name}-${index}`,
        name: asset.name,
        type: asset.mimeType?.startsWith('image/') ? ('Image' as const) : ('Document' as const),
        accent: theme.colors.input,
        text: theme.colors.textSecondary,
        modifiedLabel: 'Uploaded now',
        sizeLabel: asset.size ? formatBytes(asset.size) : 'File',
        source: 'Uploaded',
      })),
      ...current,
    ]);
  };

  return (
    <AuriaPanelScroll>
      <View style={styles.topRow}>
        <Text style={styles.title}>Gallery</Text>
        <View style={styles.topActions}>
          <SearchBox value={query} onChangeText={setQuery} />
          <Pressable style={styles.uploadButton} onPress={() => void upload()} accessibilityRole="button">
            <Text style={styles.uploadText}>Upload</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.controlRow}>
        <View style={styles.tabs}>
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setTab(item.id)}
                style={[styles.tab, active && styles.tabActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.viewActions}>
          <View style={styles.filterIcon}>
            <AuriaIcon name="filter" size={AURIA_ICON_SIZE.xs} tertiary />
          </View>
          {(['grid', 'list'] as const).map((value) => {
            const active = view === value;
            return (
              <Pressable
                key={value}
                onPress={() => setView(value)}
                style={[styles.viewButton, active && styles.viewButtonActive]}
                accessibilityRole="button"
                accessibilityLabel={`${value} view`}
                accessibilityState={{ selected: active }}
              >
                <AuriaIcon
                  name={value}
                  size={AURIA_ICON_SIZE.xs}
                  color={active ? theme.colors.text : theme.colors.textTertiary}
                  strokeWidth={AURIA_ICON_STROKE_NAV}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      {items.length === 0 ? (
        <AuriaEmptyState title="No files found" message="Try a different search or category." />
      ) : view === 'grid' ? (
        <View style={styles.grid}>
          {items.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} width={cardWidth} />
          ))}
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item, index) => (
            <GalleryListRow key={item.id} item={item} index={index} />
          ))}
        </View>
      )}

      <View style={styles.recent}>
        <Text style={styles.recentTitle}>Recent searches</Text>
        <Text style={styles.recentHint}>Your recent searches appear here.</Text>
      </View>
    </AuriaPanelScroll>
  );
}

function SearchBox({ value, onChangeText }: { value: string; onChangeText: (value: string) => void }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.searchBox}>
      <AuriaIcon name="search" size={AURIA_ICON_SIZE.xs} tertiary />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search library"
        placeholderTextColor={theme.colors.textHint}
        style={styles.searchInput}
      />
    </View>
  );
}

function GalleryCard({ item, index, width }: { item: AuriaGalleryItem; index: number; width: `${number}%` }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const image = item.type === 'Image';
  return (
    <Pressable style={[styles.card, { width }]} accessibilityRole="button">
      <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.preview}>
        {image ? <AbstractPreview index={index} /> : <FilePreview item={item} />}
      </View>
      <Text style={styles.cardMeta}>{item.type.toUpperCase()} · {item.sizeLabel}</Text>
    </Pressable>
  );
}

function FilePreview({ item }: { item: AuriaGalleryItem }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.fileIconShell}>
      <AuriaIcon name="document" size={AURIA_ICON_SIZE.md} color={item.text} />
      <Text style={[styles.fileType, { color: item.text }]}>{item.type.slice(0, 4).toUpperCase()}</Text>
    </View>
  );
}

function AbstractPreview({ index }: { index: number }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const palettes = [
    ['#102A83', '#4D78F0', '#91D9F7'],
    ['#E87C45', '#10204F', '#8ADAE9'],
    ['#155E75', '#67E8F9', '#E0F2FE'],
    ['#203879', '#7DD3FC', '#E8F4FF'],
  ];
  const palette = palettes[index % palettes.length];
  return (
    <View style={[styles.abstract, { backgroundColor: palette[0] }]}>
      <View style={[styles.abstractBand, styles.bandOne, { backgroundColor: palette[1] }]} />
      <View style={[styles.abstractBand, styles.bandTwo, { backgroundColor: palette[2] }]} />
      <View style={[styles.abstractOrb, { backgroundColor: palette[1] }]} />
    </View>
  );
}

function GalleryListRow({ item, index }: { item: AuriaGalleryItem; index: number }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Pressable style={styles.listRow} accessibilityRole="button">
      <View style={styles.listPreview}>
        {item.type === 'Image' ? <AbstractPreview index={index} /> : <FilePreview item={item} />}
      </View>
      <View style={styles.listCopy}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardMeta}>{item.type.toUpperCase()} · {item.sizeLabel}</Text>
      </View>
      <AuriaIcon name="moreHorizontal" tertiary />
    </Pressable>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    topRow: { gap: 14 },
    title: {
      ...auriaTypography.title,
      fontSize: 29,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    topActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    searchBox: {
      flex: 1,
      minHeight: 38,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surface,
    },
    searchInput: {
      ...auriaTypography.body,
      flex: 1,
      fontSize: 13,
      color: theme.colors.text,
      paddingVertical: 0,
    },
    uploadButton: {
      minHeight: 38,
      paddingHorizontal: 17,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.offBlack,
    },
    uploadText: {
      ...auriaTypography.body,
      fontSize: 12,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.surface,
    },
    controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    tabs: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    tab: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: theme.radius.pill },
    tabActive: { backgroundColor: theme.colors.input },
    tabText: { ...auriaTypography.body, fontSize: 12, color: theme.colors.textTertiary },
    tabTextActive: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold },
    viewActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    filterIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
    viewButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
    viewButtonActive: { backgroundColor: theme.colors.input },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'stretch' },
    card: {
      minHeight: 220,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      justifyContent: 'space-between',
      gap: 8,
    },
    cardName: {
      ...auriaTypography.body,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    preview: { flex: 1, minHeight: 132, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 14 },
    cardMeta: { ...auriaTypography.body, fontSize: 10, color: theme.colors.textTertiary },
    fileIconShell: {
      width: 48,
      height: 48,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      borderRadius: 13,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
    },
    fileType: { ...auriaTypography.label, fontSize: 7, fontWeight: theme.typography.fontWeight.bold },
    abstract: { width: '100%', height: '100%', overflow: 'hidden' },
    abstractBand: { position: 'absolute', width: '135%', height: '42%', borderRadius: 999, transform: [{ rotate: '-22deg' }] },
    bandOne: { left: '-18%', top: '17%' },
    bandTwo: { left: '-8%', top: '49%', opacity: 0.82 },
    abstractOrb: { position: 'absolute', right: '-12%', top: '-12%', width: '55%', aspectRatio: 1, borderRadius: 999, opacity: 0.72 },
    list: { gap: 8 },
    listRow: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 9,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
    },
    listPreview: { width: 54, height: 54, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    listCopy: { flex: 1, gap: 5 },
    recent: { paddingTop: 22, paddingBottom: 18, gap: 8 },
    recentTitle: { ...auriaTypography.body, fontSize: 13, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text },
    recentHint: { ...auriaTypography.body, fontSize: 12, color: theme.colors.textHint },
  });
}
