import type * as T from './EmojiSelector.types';

export const CATEGORY_IDS: T.EmojiCategoryId[] = [
  'smileys',
  'nature',
  'food',
  'activity',
  'travel',
  'objects',
  'symbols',
  'flags',
];

/** Category tab icons, drawn grey until active (like the macOS picker). */
export const CATEGORY_ICONS: Record<T.EmojiCategoryId | 'recent', string> = {
  recent: '🕘',
  smileys: '😀',
  nature: '🐻',
  food: '🍔',
  activity: '⚽',
  travel: '🚗',
  objects: '💡',
  symbols: '🔣',
  flags: '🏳️',
};

export const DEFAULT_LABELS: T.EmojiSelectorLabels = {
  search: 'Search',
  empty: 'No emoji found',
  recent: 'Frequently used',
  smileys: 'Smileys & People',
  nature: 'Animals & Nature',
  food: 'Food & Drink',
  activity: 'Activity',
  travel: 'Travel & Places',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
};

export const DEFAULT_RECENT = ['👍', '❤️', '😂', '🎉', '🙏', '👀', '🔥', '✅'];
export const DEFAULT_RECENT_KEY = 'homecode-ui-emoji-recent';

/** Same emoji with or without the U+FE0F presentation selector. */
export const emojiKey = (emoji: string) => emoji.replace(/\uFE0F/g, '');

const splitWords = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

/** Parse the generated "<emoji>|<name>|<words>" lines. */
export function parseEmojiData(
  data: Record<string, string>
): T.EmojiCategory[] {
  return CATEGORY_IDS.filter(id => data[id]).map(id => ({
    id,
    emojis: data[id].split('\n').map(line => {
      const [emoji, name = '', extra = ''] = line.split('|');
      return { emoji, name, words: splitWords(`${name} ${extra}`) };
    }),
  }));
}

/**
 * Emoji whose name or words start with every word of the query
 * ("thumb up" finds 👍). Pasting an emoji finds it too.
 */
export function searchEmoji(
  categories: T.EmojiCategory[],
  query: string
): T.Emoji[] {
  const raw = query.trim();
  if (!raw) return [];
  const rawKey = emojiKey(raw);
  const needles = splitWords(raw);
  const found: T.Emoji[] = [];
  for (const category of categories) {
    for (const item of category.emojis) {
      const hit =
        emojiKey(item.emoji) === rawKey ||
        (needles.length > 0 &&
          needles.every(n => item.words.some(w => w.startsWith(n))));
      if (hit) found.push(item);
    }
  }
  return found;
}

export function readRecent(key: string | null | undefined): string[] {
  if (!key) return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((e): e is string => typeof e === 'string')
      : [];
  } catch {
    return [];
  }
}

/** The pick goes first; older picks follow, up to `limit`. */
export function pushRecent(list: string[], emoji: string, limit: number) {
  return [emoji, ...list.filter(e => e !== emoji)].slice(0, limit);
}

export function writeRecent(key: string | null | undefined, list: string[]) {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Private mode or storage blocked: recents just aren't kept.
  }
}
