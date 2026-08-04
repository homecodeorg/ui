import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useEvent from 'uilib/hooks/useEvent';

import * as H from './Select.helpers';
import * as T from './Select.types';

/**
 * Open state contract:
 * - `isOpen` prop is a boolean -> fully controlled, the consumer must react to
 *   `onOpen` / `onClose` to change it.
 * - `isOpen` prop is `undefined` -> Select owns the state.
 */
export function useSelectOpenState({
  isOpen: isOpenProp,
  onOpen,
  onClose,
}: {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}) {
  const isControlled = typeof isOpenProp === 'boolean';
  const [innerIsOpen, setInnerIsOpen] = useState(false);
  const isOpen = isControlled ? isOpenProp : innerIsOpen;

  // Kept in sync during render so that two `open()` calls within one event
  // (Popup + Select both reacting to a focus) notify the consumer only once.
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const callbacks = useRef({ onOpen, onClose });
  callbacks.current = { onOpen, onClose };

  const open = useCallback(() => {
    if (isOpenRef.current) return;
    isOpenRef.current = true;
    if (!isControlled) setInnerIsOpen(true);
    callbacks.current.onOpen?.();
  }, [isControlled]);

  const close = useCallback(() => {
    if (!isOpenRef.current) return;
    isOpenRef.current = false;
    if (!isControlled) setInnerIsOpen(false);
    callbacks.current.onClose?.();
  }, [isControlled]);

  return { isOpen, open, close };
}

/**
 * Selection contract mirrors the open state one: `value` present -> controlled,
 * `value === undefined` -> Select owns the selection.
 */
export function useSelectedIds(value: T.Value | undefined) {
  const isControlled = value !== undefined;
  const [innerIds, setInnerIds] = useState<T.Id[]>([]);
  const propIds = H.toIds(value);
  const propIdsKey = H.idsKey(propIds);

  const selectedIds = useMemo(
    () => (isControlled ? propIds : innerIds),
    [isControlled, propIdsKey, innerIds]
  );

  const setSelectedIds = useCallback(
    (ids: T.Id[]) => {
      if (!isControlled) setInnerIds(ids);
    },
    [isControlled]
  );

  return { selectedIds, setSelectedIds };
}

/** Single source of truth for what the list shows and what can be navigated. */
export function useSelectOptions({
  options,
  additionalOptions,
  searchQuery,
}: {
  options: T.Option[];
  additionalOptions: T.Option[];
  searchQuery: string;
}) {
  const allOptions = useMemo(
    () =>
      additionalOptions.length ? [...additionalOptions, ...options] : options,
    [additionalOptions, options]
  );

  const visibleOptions = useMemo(
    () =>
      searchQuery
        ? allOptions.filter(option => H.matchesSearch(option, searchQuery))
        : allOptions,
    [allOptions, searchQuery]
  );

  // Group headers are rendered but never focusable/selectable.
  const navigableOptions = useMemo(
    () => visibleOptions.filter(H.isSelectable),
    [visibleOptions]
  );

  const optionsById = useMemo(() => H.mapById(allOptions), [allOptions]);

  return { allOptions, visibleOptions, navigableOptions, optionsById };
}

/**
 * Keyboard cursor. It is stored as an option id and always resolved against the
 * currently *visible* list, so filtering can never desync it from the rows.
 */
export function useKeyboardNav({
  isOpen,
  navigableOptions,
  selectedIds,
  onSelect,
}: {
  isOpen: boolean;
  navigableOptions: T.Option[];
  selectedIds: T.Id[];
  onSelect: (id: T.Id) => void;
}) {
  const [focusedId, setFocusedId] = useState<T.Id | null>(null);

  const focusedIndex = useMemo(
    () => navigableOptions.findIndex(({ id }) => id === focusedId),
    [navigableOptions, focusedId]
  );

  const latest = useRef({ navigableOptions, focusedIndex, selectedIds, onSelect });
  latest.current = { navigableOptions, focusedIndex, selectedIds, onSelect };

  const focusAt = useCallback((index: number) => {
    const { navigableOptions } = latest.current;

    if (!navigableOptions.length) {
      setFocusedId(null);
      return;
    }

    const clamped = Math.min(Math.max(index, 0), navigableOptions.length - 1);

    setFocusedId(navigableOptions[clamped].id);
  }, []);

  // On open put the cursor on the selected row, on close drop it.
  useEffect(() => {
    if (!isOpen) {
      setFocusedId(null);
      return;
    }

    const { navigableOptions, selectedIds } = latest.current;
    const preferred =
      navigableOptions.find(({ id }) => selectedIds.includes(id)) ??
      navigableOptions[0];

    setFocusedId(preferred?.id ?? null);
  }, [isOpen]);

  // Keep the cursor on a row that still exists after the list changed.
  useEffect(() => {
    if (!isOpen) return;

    setFocusedId(current =>
      current !== null && navigableOptions.some(({ id }) => id === current)
        ? current
        : (navigableOptions[0]?.id ?? null)
    );
  }, [isOpen, navigableOptions]);

  const onKeyDown = useCallback(
    (e: Event) => {
      const { key } = e as KeyboardEvent;
      const { navigableOptions, focusedIndex, onSelect } = latest.current;

      if (!navigableOptions.length) return;

      if (key === 'ArrowUp') {
        e.preventDefault();
        focusAt(focusedIndex - 1);
        return;
      }

      if (key === 'ArrowDown') {
        e.preventDefault();
        focusAt(focusedIndex + 1);
        return;
      }

      if (key === 'Enter') {
        const option = navigableOptions[focusedIndex];

        if (!option) return;

        e.preventDefault();
        e.stopPropagation();
        onSelect(option.id);
      }
    },
    [focusAt]
  );

  useEvent({ event: 'keydown', isActive: isOpen, callback: onKeyDown });

  return { focusedId, setFocusedId };
}
