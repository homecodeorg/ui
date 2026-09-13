import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';
import { Input } from 'uilib/components/Input/Input';
import { Menu } from 'uilib/components/Menu/Menu';
import { Tooltip } from 'uilib/components/Tooltip/Tooltip';
import cn from 'classnames';

import type { ChatSelectorItem, ChatSelectorProps } from './Chat.types';
import S from './ChatSelector.styl';

const NEW_CHAT_ID = '__new__';

export function ChatSelector({
  title,
  chats,
  searchQuery,
  selectedId,
  onSearch,
  onSelectChat,
  onRename,
  onNewChat,
  onSearchOpen,
  onSearchClose,
  searchPlaceholder = 'Search chats...',
  newChatLabel = '+ New chat',
  disabled,
  isLoading,
  className,
}: ChatSelectorProps) {
  const [mode, setMode] = useState<'folded' | 'search' | 'rename'>('folded');
  const [draft, setDraft] = useState(title);
  const rootRef = useRef<HTMLDivElement>(null);

  const fold = useCallback(() => {
    setMode('folded');
    setDraft(title);
    onSearchClose?.();
  }, [onSearchClose, title]);

  const openSearch = useCallback(() => {
    if (disabled) return;
    setMode('search');
    onSearch('');
    onSearchOpen?.();
  }, [disabled, onSearch, onSearchOpen]);

  const openRename = useCallback(() => {
    if (disabled) return;
    setDraft(title);
    setMode('rename');
  }, [disabled, title]);

  const commitRename = useCallback(() => {
    const next = draft.trim();
    if (next && next !== title) onRename(next);
    fold();
  }, [draft, fold, onRename, title]);

  useEffect(() => {
    if (mode === 'folded') setDraft(title);
  }, [mode, title]);

  useEffect(() => {
    if (mode !== 'search') return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) fold();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [fold, mode]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        fold();
        return;
      }
      if (mode === 'rename' && e.key === 'Enter') {
        e.preventDefault();
        commitRename();
      }
    },
    [commitRename, fold, mode]
  );

  const pick = useCallback(
    (id: string) => {
      if (id === NEW_CHAT_ID) onNewChat?.();
      else onSelectChat(id);
      fold();
    },
    [fold, onNewChat, onSelectChat]
  );

  const items: ChatSelectorItem[] = [
    { id: NEW_CHAT_ID, title: newChatLabel },
    ...chats,
  ];

  return (
    <div ref={rootRef} className={cn(S.root, className)}>
      {mode === 'folded' ? (
        <div className={S.folded}>
          <button
            type="button"
            className={S.title}
            disabled={disabled}
            onClick={openSearch}
          >
            {title}
          </button>
          {!disabled && (
            <Tooltip content="Rename" direction="bottom">
              <Button
                className={S.edit}
                variant="text"
                size="s"
                square
                aria-label="Rename"
                onClick={openRename}
              >
                <Icon type="edit" size="s" />
              </Button>
            </Tooltip>
          )}
        </div>
      ) : (
        <div onKeyDown={onInputKeyDown}>
          <Input
            className={S.input}
            variant="clean"
            size="s"
            round
            hideRequiredStar
            autoFocus
            disabled={disabled}
            value={mode === 'search' ? searchQuery : draft}
            placeholder={mode === 'search' ? searchPlaceholder : title}
            onChange={(_, val) => {
              const next = String(val);
              if (mode === 'search') onSearch(next);
              else setDraft(next);
            }}
            onBlur={() => {
              if (mode === 'rename') commitRename();
            }}
          />
        </div>
      )}
      {mode === 'search' && (
        <Menu className={S.list} size="s">
          {items.map(item => (
            <Menu.Item
              key={item.id}
              className={cn(
                S.item,
                item.id === NEW_CHAT_ID && S.newChat,
                item.id === selectedId && S.selected
              )}
              selected={item.id === selectedId}
              textOverflow
              onClick={() => pick(item.id)}
            >
              {item.title}
            </Menu.Item>
          ))}
          {isLoading && chats.length === 0 && (
            <Menu.Item className={S.empty} disabled>
              Loading…
            </Menu.Item>
          )}
        </Menu>
      )}
    </div>
  );
}
