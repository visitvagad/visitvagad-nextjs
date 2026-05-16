'use client';

import { Bookmark } from 'lucide-react';
import { useBookmarks, type BookmarkItem } from '@/hooks/use-bookmarks';

interface BookmarkButtonProps {
  item: Omit<BookmarkItem, 'savedAt'>;
}

export function BookmarkButton({ item }: BookmarkButtonProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(item.slug, item.type);

  const toggle = () => {
    if (saved) removeBookmark(item.slug, item.type);
    else addBookmark(item);
  };

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Remove bookmark' : 'Save to bookmarks'}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors"
      style={{
        borderColor: saved ? 'var(--color-deep-teal)' : 'var(--color-border)',
        backgroundColor: saved ? 'var(--color-deep-teal)' : 'transparent',
        color: saved ? 'var(--color-off-white)' : 'var(--color-text-secondary)',
      }}
    >
      <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
