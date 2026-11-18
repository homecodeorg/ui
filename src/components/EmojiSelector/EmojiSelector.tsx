import cn from 'classnames';
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Input } from 'uilib/components/Input/Input';

import S from './EmojiSelector.styl';
import {
  CATEGORY_ICONS,
  DEFAULT_LABELS,
  DEFAULT_RECENT,
  DEFAULT_RECENT_KEY,
  emojiKey,
  parseEmojiData,
  pushRecent,
  readRecent,
  searchEmoji,
  writeRecent,
} from './EmojiSelector.helpers';
import type * as T from './EmojiSelector.types';

export type {
  Props as EmojiSelectorProps,
  EmojiSelectorLabels,
  EmojiCategoryId,
} from './EmojiSelector.types';

type SectionId = T.EmojiCategoryId | 'recent' | 'results';
type Section = { id: SectionId; title: string; emojis: T.Emoji[] };

// The emoji list is a separate chunk, loaded the first time a selector opens.
let loadedCategories: T.EmojiCategory[] | null = null;
let loading: Promise<T.EmojiCategory[]> | null = null;

function loadCategories() {
  loading ??= import('./emojiData').then(m => {
    loadedCategories = parseEmojiData(m.EMOJI_DATA);
    return loadedCategories;
  });
  return loading;
}

/** Next emoji button in a direction, by on-screen position. */
function neighbour(
  buttons: HTMLElement[],
  from: HTMLElement,
  key: string
): HTMLElement | undefined {
  const i = buttons.indexOf(from);
  if (key === 'ArrowLeft') return buttons[i - 1];
  if (key === 'ArrowRight') return buttons[i + 1];
  const down = key === 'ArrowDown';
  const at = from.getBoundingClientRect();
  const step = down ? 1 : -1;
  let rowTop: number | undefined;
  let best: HTMLElement | undefined;
  let bestDx = Infinity;
  for (let j = i + step; j >= 0 && j < buttons.length; j += step) {
    const r = buttons[j].getBoundingClientRect();
    if (Math.abs(r.top - at.top) < 2) continue;
    rowTop ??= r.top;
    if (Math.abs(r.top - rowTop) >= 2) break;
    const dx = Math.abs(r.left - at.left);
    if (dx < bestDx) {
      bestDx = dx;
      best = buttons[j];
    }
  }
  return best;
}

/**
 * Emoji picker like the macOS one: search, frequently used, categories with
 * a tab bar at the bottom. Emoji only; put it in a Popup to open it from a
 * button.
 */
export function EmojiSelector({
  onSelect,
  selected,
  recent,
  defaultRecent = DEFAULT_RECENT,
  recentStorageKey = DEFAULT_RECENT_KEY,
  recentLimit = 16,
  labels: labelsProp,
  autoFocus = true,
  className,
}: T.Props) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [categories, setCategories] = useState(loadedCategories);
  const [query, setQuery] = useState('');
  const [stored, setStored] = useState(() => readRecent(recentStorageKey));
  const [activeTab, setActiveTab] = useState<SectionId>('recent');
  const listRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef(new Map<SectionId, HTMLElement>());

  useEffect(() => {
    if (categories) return;
    let alive = true;
    void loadCategories().then(c => alive && setCategories(c));
    return () => {
      alive = false;
    };
  }, [categories]);

  const byEmoji = useMemo(() => {
    const map = new Map<string, T.Emoji>();
    for (const c of categories ?? []) {
      for (const e of c.emojis) map.set(emojiKey(e.emoji), e);
    }
    return map;
  }, [categories]);

  const recentEmojis = useMemo(() => {
    const list = recent ?? (stored.length > 0 ? stored : defaultRecent);
    return list.map(
      e =>
        byEmoji.get(emojiKey(e)) ?? { emoji: e, name: e, words: [] as string[] }
    );
  }, [recent, stored, defaultRecent, byEmoji]);

  const sections = useMemo<Section[]>(() => {
    if (!categories) return [];
    if (query.trim()) {
      return [
        {
          id: 'results',
          title: '',
          emojis: searchEmoji(categories, query),
        },
      ];
    }
    return [
      ...(recentEmojis.length > 0
        ? [
            {
              id: 'recent' as const,
              title: labels.recent,
              emojis: recentEmojis,
            },
          ]
        : []),
      ...categories.map(c => ({
        id: c.id,
        title: labels[c.id],
        emojis: c.emojis,
      })),
    ];
  }, [categories, query, recentEmojis, labels.recent, labelsProp]);

  const tabs: Exclude<SectionId, 'results'>[] = [
    ...(recentEmojis.length > 0 ? (['recent'] as const) : []),
    ...(categories ?? []).map(c => c.id),
  ];

  const pick = (emoji: string) => {
    if (!recent) {
      const next = pushRecent(stored, emoji, recentLimit);
      setStored(next);
      writeRecent(recentStorageKey, next);
    }
    onSelect(emoji);
  };

  // The tab of the section at the top of the list.
  const onScroll = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    let current: SectionId | undefined;
    for (const [id, el] of sectionRefs.current) {
      if (el.offsetTop - list.scrollTop <= 8) current = id;
    }
    if (current && current !== 'results') setActiveTab(current);
  }, []);

  const goToSection = (id: SectionId) => {
    setQuery('');
    setActiveTab(id);
    // After the search results are gone.
    requestAnimationFrame(() => {
      const list = listRef.current;
      const el = sectionRefs.current.get(id);
      if (list && el) list.scrollTop = el.offsetTop;
    });
  };

  const buttons = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[data-emoji]') ?? []
    );

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.key.startsWith('Arrow')) return;
    const from = e.target as HTMLElement;
    if (!from.dataset.emoji) return;
    const next = neighbour(buttons(), from, e.key);
    e.preventDefault();
    next?.focus();
    next?.scrollIntoView?.({ block: 'nearest' });
  };

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const first = buttons()[0];
    if (!first) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      pick(first.dataset.emoji!);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      first.focus();
    }
  };

  const chosen = new Set(selected?.map(emojiKey));
  const isSearching = Boolean(query.trim());

  return (
    <div className={cn(S.root, className)}>
      <Input
        className={S.search}
        size="s"
        value={query}
        placeholder={labels.search}
        autoFocus={autoFocus}
        hasClear
        onChange={(_, value) => {
          setQuery(String(value));
          if (listRef.current) listRef.current.scrollTop = 0;
        }}
        controlProps={{ onKeyDown: onSearchKeyDown }}
      />

      <div
        ref={listRef}
        className={S.list}
        onScroll={onScroll}
        onKeyDown={onGridKeyDown}
      >
        {sections.map(section => (
          <section
            key={section.id}
            className={S.section}
            ref={el => {
              if (el) sectionRefs.current.set(section.id, el);
              else sectionRefs.current.delete(section.id);
            }}
          >
            {section.title && (
              <div className={S.sectionTitle}>{section.title}</div>
            )}
            <div className={S.grid}>
              {section.emojis.map(item => (
                <button
                  key={item.emoji}
                  type="button"
                  className={cn(
                    S.emoji,
                    chosen.has(emojiKey(item.emoji)) && S.chosen
                  )}
                  data-emoji={item.emoji}
                  title={item.name}
                  aria-label={item.name}
                  aria-pressed={chosen.has(emojiKey(item.emoji))}
                  onClick={() => pick(item.emoji)}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </section>
        ))}
        {isSearching && sections[0]?.emojis.length === 0 && (
          <div className={S.empty}>{labels.empty}</div>
        )}
      </div>

      <div className={S.tabs} role="tablist">
        {tabs.map(id => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={!isSearching && activeTab === id}
            aria-label={labels[id]}
            title={labels[id]}
            className={cn(
              S.tab,
              !isSearching && activeTab === id && S.tabActive
            )}
            onClick={() => goToSection(id)}
          >
            {CATEGORY_ICONS[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
