export type EmojiCategoryId =
  | 'smileys'
  | 'nature'
  | 'food'
  | 'activity'
  | 'travel'
  | 'objects'
  | 'symbols'
  | 'flags';

export type EmojiSelectorLabels = {
  search: string;
  empty: string;
  recent: string;
} & Record<EmojiCategoryId, string>;

export type Emoji = {
  emoji: string;
  name: string;
  /** Lowercase words the search matches against (name + extra words). */
  words: string[];
};

export type EmojiCategory = {
  id: EmojiCategoryId;
  emojis: Emoji[];
};

export type Props = {
  /** Called with the picked emoji. */
  onSelect: (emoji: string) => void;
  /** Emoji to show as chosen, e.g. the reactions already on a message. */
  selected?: string[];
  /**
   * Emoji for the first "Frequently used" row. Without it the selector keeps
   * the last picks in localStorage under `recentStorageKey`.
   */
  recent?: string[];
  /** Shown as frequently used until anything has been picked. */
  defaultRecent?: string[];
  /** localStorage key for the last picks; null keeps nothing. */
  recentStorageKey?: string | null;
  /** How many frequently used emoji to keep. */
  recentLimit?: number;
  /** Texts, for translation. */
  labels?: Partial<EmojiSelectorLabels>;
  /** Focus the search field when shown. */
  autoFocus?: boolean;
  className?: string;
};
