'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'visitvagad_bookmarks';
const RECENT_KEY = 'visitvagad_recent';
const MAX_RECENT = 10;

export interface BookmarkItem {
  slug: string;
  title: string;
  type: 'destination' | 'event' | 'itinerary' | 'food';
  image?: string;
  savedAt: string;
}

export interface RecentItem {
  slug: string;
  title: string;
  type: 'destination' | 'event' | 'itinerary' | 'food';
  image?: string;
  viewedAt: string;
}

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota exceeded */ }
}

/** Hook for managing saved/bookmarked destinations */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    setBookmarks(getFromStorage<BookmarkItem[]>(STORAGE_KEY, []));
  }, []);

  const addBookmark = useCallback((item: Omit<BookmarkItem, 'savedAt'>) => {
    setBookmarks(prev => {
      if (prev.some(b => b.slug === item.slug && b.type === item.type)) return prev;
      const next = [{ ...item, savedAt: new Date().toISOString() }, ...prev];
      setToStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const removeBookmark = useCallback((slug: string, type: string) => {
    setBookmarks(prev => {
      const next = prev.filter(b => !(b.slug === slug && b.type === type));
      setToStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((slug: string, type: string) => {
    return bookmarks.some(b => b.slug === slug && b.type === type);
  }, [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}

/** Hook for tracking recently viewed items */
export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentItem[]>([]);

  useEffect(() => {
    setRecent(getFromStorage<RecentItem[]>(RECENT_KEY, []));
  }, []);

  const trackView = useCallback((item: Omit<RecentItem, 'viewedAt'>) => {
    setRecent(prev => {
      const filtered = prev.filter(r => !(r.slug === item.slug && r.type === item.type));
      const next = [{ ...item, viewedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_RECENT);
      setToStorage(RECENT_KEY, next);
      return next;
    });
  }, []);

  return { recent, trackView };
}
