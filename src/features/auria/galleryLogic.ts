import type { AuriaGalleryCategory, AuriaGalleryItem } from '../../data/auriaMockData';

export type AuriaGalleryTab = 'all' | 'images' | 'files';
export type AuriaGalleryView = 'grid' | 'list';
export type AuriaGalleryTypeFilter = AuriaGalleryCategory | null;

export function isGalleryImage(item: AuriaGalleryItem): boolean {
  return item.type === 'Image';
}

export function filterGalleryItems(
  items: readonly AuriaGalleryItem[],
  options: {
    tab: AuriaGalleryTab;
    query: string;
    typeFilter: AuriaGalleryTypeFilter;
  },
): AuriaGalleryItem[] {
  const query = options.query.trim().toLowerCase();

  return items.filter((item) => {
    if (options.tab === 'images' && !isGalleryImage(item)) return false;
    if (options.tab === 'files' && isGalleryImage(item)) return false;
    if (options.typeFilter && item.type !== options.typeFilter) return false;
    if (query && !`${item.name} ${item.source} ${item.type}`.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });
}
