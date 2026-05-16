'use client';

import { useEffect } from 'react';
import { useRecentlyViewed, type RecentItem } from '@/hooks/use-bookmarks';

/** Invisible component that tracks page views in localStorage */
export function TrackView({ item }: { item: Omit<RecentItem, 'viewedAt'> }) {
  const { trackView } = useRecentlyViewed();

  useEffect(() => {
    trackView(item);
  }, [item.slug, item.type]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
