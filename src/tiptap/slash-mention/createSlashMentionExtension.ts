import type { MutableRefObject } from 'react';

import { type Editor, mergeAttributes } from '@tiptap/core';
import Mention from '@tiptap/extension-mention';
import { PluginKey, type EditorState } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import type { SuggestionProps } from '@tiptap/suggestion';

import {
  SlashSuggestionList,
  type SlashSuggestionListHandle,
} from './SlashSuggestionList';
import S from './SlashSuggestionList.styl';
import { filterSlashItems } from './defaultChatSlashItems';
import type {
  CreateSlashMentionExtensionOptions,
  SlashCommandItem,
  SlashGetItems,
  SlashSuggestionPlacement,
} from './types';

/** Keep `/` as `mention` for backward-compatible KnowledgeSelector docs. */
function mentionExtensionName(slashChar: string): string {
  return slashChar === '/' ? 'mention' : `mention_${slashChar.charCodeAt(0)}`;
}

function createNamedSlashMention(slashChar: string) {
  return Mention.extend({
    name: mentionExtensionName(slashChar),
    addAttributes() {
      return {
        ...this.parent?.(),
        className: {
          default: null,
          parseHTML: element => element.getAttribute('data-slash-class'),
          renderHTML: attributes => {
            if (!attributes.className) return {};
            return { 'data-slash-class': attributes.className };
          },
        },
        color: {
          default: null,
          parseHTML: element => element.getAttribute('data-slash-color'),
          renderHTML: attributes => {
            if (!attributes.color) return {};
            return { 'data-slash-color': attributes.color };
          },
        },
      };
    },
  });
}

const SUGGESTION_GAP_PX = 4;

function placeSlashSuggestionPopup(
  popupElement: HTMLElement,
  clientRect: DOMRect | null | undefined,
  placement: SlashSuggestionPlacement,
  editorElement?: HTMLElement | null
): void {
  if (!clientRect) return;

  const el = popupElement;
  const popupRect = el.getBoundingClientRect();
  const popupHeight = popupRect.height;
  const popupWidth = popupRect.width;
  const spaceBelow = window.innerHeight - clientRect.bottom - SUGGESTION_GAP_PX;
  const spaceAbove = clientRect.top - SUGGESTION_GAP_PX;

  let showAbove = placement === 'above';
  if (placement === 'auto') {
    showAbove = spaceBelow < popupHeight && spaceAbove >= spaceBelow;
  }

  const top = showAbove
    ? Math.max(
        SUGGESTION_GAP_PX,
        clientRect.top - popupHeight - SUGGESTION_GAP_PX
      )
    : clientRect.bottom + SUGGESTION_GAP_PX;

  const editorRect = editorElement?.getBoundingClientRect();
  let left = editorRect ? editorRect.left : clientRect.left;
  const maxLeft = window.innerWidth - popupWidth - SUGGESTION_GAP_PX;
  left = Math.max(SUGGESTION_GAP_PX, Math.min(left, maxLeft));

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
}

export function slashMentionSuggestionRender(
  uiRef: MutableRefObject<SlashSuggestionListHandle | null>,
  placement: SlashSuggestionPlacement = 'below'
): {
  onStart?: (
    props: SuggestionProps<SlashCommandItem, SlashCommandItem>
  ) => void;
  onUpdate?: (
    props: SuggestionProps<SlashCommandItem, SlashCommandItem>
  ) => void;
  onExit?: (props: SuggestionProps<SlashCommandItem, SlashCommandItem>) => void;
  onKeyDown?: (p: {
    view: unknown;
    event: KeyboardEvent;
    range: { from: number; to: number };
  }) => boolean;
} {
  let popup: ReactRenderer<{
    items: SlashCommandItem[];
    command: (item: SlashCommandItem) => void;
    listHandleRef: MutableRefObject<SlashSuggestionListHandle | null>;
  }> | null = null;

  const place = (
    props: Pick<
      SuggestionProps<SlashCommandItem, SlashCommandItem>,
      'clientRect' | 'editor'
    >
  ) => {
    if (!popup?.element) return;
    placeSlashSuggestionPopup(
      popup.element,
      props.clientRect?.() ?? null,
      placement,
      props.editor.view.dom
    );
  };

  return {
    onStart: props => {
      uiRef.current = null;
      popup?.destroy?.();
      popup = new ReactRenderer(SlashSuggestionList, {
        editor: props.editor,
        props: {
          items: props.items,
          command: props.command,
          listHandleRef: uiRef,
        },
      });
      popup.element.style.position = 'fixed';
      popup.element.style.margin = '0';
      popup.element.style.zIndex = '10002';
      document.body.append(popup.element);
      place(props);
      requestAnimationFrame(() => place(props));
    },
    onUpdate: props => {
      if (!popup) return;
      popup.updateProps({
        items: props.items,
        command: props.command,
        listHandleRef: uiRef,
      });
      place(props);
      requestAnimationFrame(() => place(props));
    },
    onExit: () => {
      popup?.destroy();
      popup?.element?.remove?.();
      popup = null;
      uiRef.current = null;
    },
    onKeyDown: ({ event }) =>
      uiRef.current?.onKeyboardEvent(event as KeyboardEvent) ?? false,
  };
}

function slashMentionChipStyle(color: string | null): string | undefined {
  if (!color) return undefined;
  return `color: ${color}; background-color: color-mix(in srgb, ${color} 30%, transparent);`;
}

function insertDefaultMention(
  editor: Editor,
  range: { from: number; to: number },
  item: SlashCommandItem,
  slashChar: string
): void {
  const nodeAfter = editor.view.state.selection.$to.nodeAfter;
  const extend = nodeAfter?.text?.startsWith(' ') ? 1 : 0;
  const adjusted = extend ? { ...range, to: range.to + extend } : range;
  const nodeType = mentionExtensionName(slashChar);

  editor
    .chain()
    .focus()
    .insertContentAt(adjusted, [
      {
        type: nodeType,
        attrs: {
          id: item.id,
          label: item.label,
          mentionSuggestionChar: slashChar,
          className: item.className ?? null,
          color: item.color ?? null,
        },
      },
      { type: 'text', text: ' ' },
    ])
    .run();

  queueMicrotask(() => {
    editor.view.dom.ownerDocument?.defaultView
      ?.getSelection?.()
      ?.collapseToEnd();
  });
}

function allowSlashTrigger({
  state,
  range,
  slashChar,
}: {
  editor: Editor;
  state: EditorState;
  range: { from: number; to: number };
  slashChar: string;
}) {
  const type = state.schema.nodes[mentionExtensionName(slashChar)];
  const $from = state.doc.resolve(range.from);
  if (!type || !$from.parent.type.contentMatch.matchType(type)) return false;
  if ($from.parentOffset === 0) return true;
  const before = state.doc.textBetween(range.from - 1, range.from);
  return /\s/.test(before);
}

export type CreateSlashMentionExtensionConfiguredOptions =
  CreateSlashMentionExtensionOptions & {
    onSuggestionUiActiveChange?: (active: boolean) => void;
  };

async function resolveSuggestionItems(
  query: string,
  staticItems: SlashCommandItem[] | undefined,
  getItems: SlashGetItems | undefined
): Promise<SlashCommandItem[]> {
  if (getItems) {
    return Promise.resolve(getItems(query));
  }
  return filterSlashItems(staticItems ?? [], query);
}

export function createSlashMentionExtension({
  items: resolvedItems,
  getItems,
  slashChar = '/',
  pluginKey,
  onItemCommand,
  suggestionPlacement = 'below',
  onSuggestionUiActiveChange,
}: CreateSlashMentionExtensionConfiguredOptions) {
  const uiRef: MutableRefObject<SlashSuggestionListHandle | null> = {
    current: null,
  };

  const SlashMention = createNamedSlashMention(slashChar);
  const resolvedPluginKey =
    pluginKey ?? new PluginKey(`slashMention${slashChar.charCodeAt(0)}`);

  return SlashMention.configure({
    renderText({ node }) {
      const label =
        typeof node.attrs.label === 'string' && node.attrs.label.trim() !== ''
          ? node.attrs.label
          : String(node.attrs.id ?? '');
      return `${slashChar}${label}`;
    },
    renderHTML({ options, node }) {
      const id =
        typeof node.attrs.id === 'string'
          ? node.attrs.id
          : String(node.attrs.id ?? '');
      const label =
        typeof node.attrs.label === 'string' && node.attrs.label.trim() !== ''
          ? node.attrs.label
          : id;
      const color =
        typeof node.attrs.color === 'string' ? node.attrs.color : null;
      const className = [S.mention, node.attrs.className]
        .filter(Boolean)
        .join(' ');
      const chipStyle = slashMentionChipStyle(color);

      return [
        'span',
        mergeAttributes(
          {
            'data-type': 'mention',
            'data-slash-command': id,
            class: className,
            ...(chipStyle ? { style: chipStyle } : {}),
          },
          options.HTMLAttributes
        ),
        label,
      ];
    },
    suggestion: {
      char: slashChar,
      pluginKey: resolvedPluginKey,
      allowedPrefixes: [' ', '\n', '\t', '\r'],
      allow: props => allowSlashTrigger({ ...props, slashChar }),
      items: ({ query }) =>
        resolveSuggestionItems(query, resolvedItems, getItems),
      command: ({ editor, range, props }) => {
        const item = props as SlashCommandItem;
        if (onItemCommand?.({ editor, range, item }) === true) {
          return null;
        }
        insertDefaultMention(editor, range, item, slashChar);
        return null;
      },
      render: () => {
        const menu = slashMentionSuggestionRender(uiRef, suggestionPlacement);
        return {
          ...menu,
          onStart: props => {
            onSuggestionUiActiveChange?.(true);
            menu.onStart?.(props);
          },
          onExit: props => {
            menu.onExit?.(props);
            onSuggestionUiActiveChange?.(false);
          },
        };
      },
    },
  });
}
