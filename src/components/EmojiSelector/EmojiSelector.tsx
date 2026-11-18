import cn from 'classnames';
import {
  type CSSProperties,
  Fragment,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Input } from 'uilib/components/Input/Input';
import VirtualizedList from 'uilib/components/Virtualized/List/List';
import type { ItemProps } from 'uilib/components/Virtualized/Virtualized.types';

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
/**
 * One list row: a section title or up to COLUMNS emoji. VirtualizedList
 * needs one item height, so rows are made of units of a third of a cell:
 * an emoji row takes 3, a title 2.
 */
type Row = { unit: number; units: number } & (
  | { kind: 'title'; title: string }
  | { kind: 'emojis'; emojis: T.Emoji[] }
);
type Cell = { row: number; col: number };
/** Where a section starts, in units. */
type SectionStart = { id: SectionId; title: string; unit: number };

const COLUMNS = 8;
const CELL = 36;
// The list's side padding: rows sit inside it, titles span it.
const SIDE_PAD = 8;
const EMOJI_UNITS = 3;
const TITLE_UNITS = 2;

/** Rows for VirtualizedList, which needs one height for every row. */
function toRows(sections: Section[]) {
  const rows: Row[] = [];
  const starts: SectionStart[] = [];
  // The row that starts at each unit, -1 inside a row.
  const rowAt: number[] = [];
  const add = (row: Row) => {
    rowAt.push(rows.length);
    for (let i = 1; i < row.units; i++) rowAt.push(-1);
    rows.push(row);
  };
  for (const section of sections) {
    const { id, title } = section;
    starts.push({ id, title, unit: rowAt.length });
    if (title) {
      add({ kind: 'title', title, unit: rowAt.length, units: TITLE_UNITS });
    }
    for (let i = 0; i < section.emojis.length; i += COLUMNS) {
      add({
        kind: 'emojis',
        emojis: section.emojis.slice(i, i + COLUMNS),
        unit: rowAt.length,
        units: EMOJI_UNITS,
      });
    }
  }
  return { rows, starts, rowAt };
}

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

/** Next emoji row from `row` in a direction (title rows skipped). */
function nextEmojiRow(rows: Row[], row: number, step: 1 | -1) {
  for (let r = row + step; r >= 0 && r < rows.length; r += step) {
    if (rows[r].kind === 'emojis') return r;
  }
  return -1;
}

/** The cell an arrow key moves to, by rows and columns of the data. */
function moveCell(rows: Row[], at: Cell, key: string): Cell | null {
  const { row, col } = at;
  const len = (r: number) => (rows[r] as { emojis: T.Emoji[] }).emojis.length;
  if (key === 'ArrowLeft') {
    if (col > 0) return { row, col: col - 1 };
    const r = nextEmojiRow(rows, row, -1);
    return r < 0 ? null : { row: r, col: len(r) - 1 };
  }
  if (key === 'ArrowRight') {
    if (col < len(row) - 1) return { row, col: col + 1 };
    const r = nextEmojiRow(rows, row, 1);
    return r < 0 ? null : { row: r, col: 0 };
  }
  const r = nextEmojiRow(rows, row, key === 'ArrowDown' ? 1 : -1);
  return r < 0 ? null : { row: r, col: Math.min(col, len(r) - 1) };
}

/**
 * Emoji picker like the macOS one: search, frequently used, categories with
 * a tab bar at the bottom. Emoji only; put it in a Popup to open it from a
 * button. Only the rows in view are rendered (VirtualizedList).
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
  // Emoji row height = cell size: 36px, less in a narrower popup (phones).
  const [rowHeight, setRowHeight] = useState(CELL);
  const rootRef = useRef<HTMLDivElement>(null);
  const listWrapRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);

  // Inner corners follow the wrapper's (a Popup's) corner radius.
  useLayoutEffect(() => {
    const root = rootRef.current;
    let el = root?.parentElement;
    for (let i = 0; el && i < 4; i++, el = el.parentElement) {
      const radius = parseFloat(getComputedStyle(el).borderBottomLeftRadius);
      if (radius > 0) {
        root!.style.setProperty('--emoji-selector-radius', `${radius}px`);
        return;
      }
    }
  }, []);

  // Not autoFocus: in a popup that is still being placed, focusing would
  // scroll the page, and a popup closes on an outside scroll.
  useEffect(() => {
    if (!autoFocus) return;
    rootRef.current
      ?.querySelector<HTMLInputElement>('input')
      ?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    if (categories) return;
    let alive = true;
    void loadCategories().then(c => alive && setCategories(c));
    return () => {
      alive = false;
    };
  }, [categories]);

  const listElem = () =>
    listWrapRef.current?.querySelector<HTMLElement>(`.${S.list}`) ?? null;

  useLayoutEffect(() => {
    const wrap = listWrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const width = wrap.clientWidth - SIDE_PAD * 2;
      if (width > 0) setRowHeight(Math.min(CELL, width / COLUMNS));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

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

  const { rows, starts, rowAt } = useMemo(() => toRows(sections), [sections]);
  const unit = rowHeight / EMOJI_UNITS;

  const tabs: Exclude<SectionId, 'results'>[] = [
    ...(recentEmojis.length > 0 ? (['recent'] as const) : []),
    ...(categories ?? []).map(c => c.id),
  ];

  // Read by the scroll handler, which is bound once.
  const layout = useRef({ rows, starts, unit });
  layout.current = { rows, starts, unit };

  // Titles can't be sticky in a virtualized list (rows are placed
  // absolutely), so one pinned title on top shows the section in view,
  // pushed up by the next title like a sticky one. Set on the DOM directly:
  // scrolling re-renders nothing here. The active tab follows the same way.
  const syncScroll = useCallback(() => {
    const list = listElem();
    const pinned = pinnedRef.current;
    if (!list || !pinned) return;
    const { starts: all, unit: u } = layout.current;
    const top = list.scrollTop;
    let i = -1;
    while (i + 1 < all.length && all[i + 1].unit * u <= top + 0.5) i++;
    const current = all[i];
    if (!current?.title) {
      pinned.hidden = true;
    } else {
      const next = all[i + 1];
      const pinnedHeight = TITLE_UNITS * u;
      const shift = next ? Math.min(0, next.unit * u - top - pinnedHeight) : 0;
      pinned.hidden = false;
      pinned.textContent = current.title;
      pinned.style.transform = `translateY(${shift}px)`;
      pinned.style.right = `${list.offsetWidth - list.clientWidth}px`;
    }
    let tab: SectionId | undefined;
    for (const s of all) if (s.unit * u - top <= 8) tab = s.id;
    if (tab && tab !== 'results') setActiveTab(tab);
  }, []);

  useEffect(() => {
    const list = listElem();
    list?.addEventListener('scroll', syncScroll, { passive: true });
    return () => list?.removeEventListener('scroll', syncScroll);
  }, [syncScroll]);

  useLayoutEffect(syncScroll, [rows, unit, syncScroll]);

  const setScrollTop = (top: number) => {
    const list = listElem();
    if (list) list.scrollTop = top;
  };

  const pick = (emoji: string) => {
    if (!recent) {
      const next = pushRecent(stored, emoji, recentLimit);
      setStored(next);
      writeRecent(recentStorageKey, next);
    }
    onSelect(emoji);
  };

  const goToSection = (id: SectionId) => {
    setQuery('');
    setActiveTab(id);
    // After the search results are gone.
    requestAnimationFrame(() => {
      const start = layout.current.starts.find(s => s.id === id);
      if (start) setScrollTop(start.unit * layout.current.unit);
    });
  };

  // Keyboard focus works on the data, not on the buttons in the DOM: the
  // target row may not be rendered yet. It is scrolled into view and gets
  // focus as soon as its button mounts.
  const pendingFocus = useRef<Cell | null>(null);

  const cellButton = ({ row, col }: Cell) =>
    listWrapRef.current?.querySelector<HTMLElement>(
      `[data-row="${row}"][data-col="${col}"]`
    ) ?? null;

  const focusCell = (cell: Cell) => {
    const list = listElem();
    if (list) {
      const { rows: all, unit: u } = layout.current;
      const row = all[cell.row];
      const top = row.unit * u;
      const bottom = top + row.units * u;
      // The pinned title covers the top of the viewport.
      const covered = TITLE_UNITS * u;
      if (top < list.scrollTop + covered) {
        list.scrollTop = Math.max(0, top - covered);
      } else if (bottom > list.scrollTop + list.clientHeight) {
        list.scrollTop = bottom - list.clientHeight;
      }
    }
    const button = cellButton(cell);
    if (button) {
      pendingFocus.current = null;
      button.focus({ preventScroll: true });
    } else {
      pendingFocus.current = cell;
    }
  };

  const firstCell = (): Cell | null => {
    const row = nextEmojiRow(rows, -1, 1);
    return row < 0 ? null : { row, col: 0 };
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.key.startsWith('Arrow')) return;
    const { row, col } = (e.target as HTMLElement).dataset;
    if (row === undefined || col === undefined) return;
    e.preventDefault();
    const from = pendingFocus.current ?? { row: +row, col: +col };
    const to = moveCell(rows, from, e.key);
    if (to) focusCell(to);
    else if (e.key === 'ArrowUp') {
      pendingFocus.current = null;
      rootRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    }
  };

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const first = firstCell();
    if (!first) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      const firstRow = rows[first.row] as { emojis: T.Emoji[] };
      pick(firstRow.emojis[0].emoji);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusCell(first);
    }
  };

  const chosen = new Set(selected?.map(emojiKey));
  const isSearching = Boolean(query.trim());

  const renderRow = ({ key, className: itemClass, style }: ItemProps) => {
    const index = rowAt[key] ?? -1;
    const row = rows[index];
    // Units inside a row render nothing; the row's first unit draws it all.
    if (!row) return <Fragment key={key} />;
    const rowStyle = { ...style, height: row.units * unit };
    if (row.kind === 'title') {
      return (
        <div
          key={key}
          className={cn(itemClass, S.sectionTitle)}
          style={rowStyle}
        >
          {row.title}
        </div>
      );
    }
    return (
      <div key={key} className={cn(itemClass, S.row)} style={rowStyle}>
        {row.emojis.map((item, col) => (
          <button
            key={item.emoji}
            ref={el => {
              const want = pendingFocus.current;
              if (el && want?.row === index && want.col === col) {
                pendingFocus.current = null;
                el.focus({ preventScroll: true });
              }
            }}
            data-row={index}
            data-col={col}
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
    );
  };

  return (
    <div ref={rootRef} className={cn(S.root, className)}>
      <Input
        className={S.search}
        size="s"
        value={query}
        placeholder={labels.search}
        hasClear
        onChange={(_, value) => {
          setQuery(String(value));
          setScrollTop(0);
        }}
        controlProps={{ onKeyDown: onSearchKeyDown }}
      />

      <div
        ref={listWrapRef}
        className={S.listWrap}
        onKeyDown={onGridKeyDown}
        style={
          {
            '--emoji-title-height': `${TITLE_UNITS * unit}px`,
          } as CSSProperties
        }
      >
        <VirtualizedList
          className={S.list}
          // A new id re-reads the rows in view.
          id={`${query}|${unit}|${rowAt.length}`}
          itemHeight={unit}
          itemsCount={rowAt.length}
          totalCount={rowAt.length}
          // At least a row's units, so a row cut by the top still renders.
          overlapCount={EMOJI_UNITS * 3}
          offsetAfter={4}
          renderItem={renderRow}
        />
        <div ref={pinnedRef} className={cn(S.sectionTitle, S.pinned)} hidden />
        {isSearching && rows.length === 0 && (
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
