import type { Editor, JSONContent } from '@tiptap/core';

import { promptComposerParagraphDoc } from './promptComposerDoc';

export type PromptComposerInsertOptions = {
  /** Explicit document range to replace before insert. */
  replaceRange?: { from: number; to: number };
  /**
   * If no replaceRange, delete token before caret back to whitespace/start.
   * Default true.
   */
  replaceTriggerToken?: boolean;
  /** Add whitespace after inserted content. Default true. */
  trailingSpace?: boolean;
};

export const PROMPT_COMPOSER_COMMAND_CHIP_CLASS =
  'prompt-composer-command-chip';

export type PromptComposerHandle = {
  insertAtCaret: (
    content: string | JSONContent,
    options?: PromptComposerInsertOptions
  ) => void;
  focus: () => void;
  reset: () => void;
  getText: () => string;
  setContent: (
    text: string,
    options?: { focus?: boolean; atEnd?: boolean }
  ) => void;
  getEditor: () => Editor;
};

export function getPromptComposerTokenRangeBeforePos(
  editor: Editor,
  pos: number
): { from: number; to: number } {
  const $pos = editor.state.doc.resolve(pos);
  const textBefore = $pos.parent.textBetween(
    0,
    $pos.parentOffset,
    undefined,
    '\ufffc'
  );
  const token = textBefore.match(/[^\s]*$/)?.[0] ?? '';
  return { from: pos - token.length, to: pos };
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function promptComposerChipHtml(
  text: string,
  className: string = PROMPT_COMPOSER_COMMAND_CHIP_CLASS
): string {
  const cls = className ? ` class="${className}"` : '';
  return `<span${cls} data-prompt-composer-chip="true">${escapeHtml(text)}</span>`;
}

export type PromptComposerMentionNodeInput = {
  id: string;
  label?: string;
  className?: string | null;
  color?: string | null;
  slashChar?: string;
};

export function promptComposerMentionNode(
  input: PromptComposerMentionNodeInput
): JSONContent {
  const {
    id,
    label = id,
    className = null,
    color = null,
    slashChar = '/',
  } = input;

  return {
    type: 'mention',
    attrs: {
      id,
      label,
      mentionSuggestionChar: slashChar,
      className,
      color,
    },
  };
}

export function insertPromptComposerContentAtCaret(
  editor: Editor,
  content: string | JSONContent,
  options?: PromptComposerInsertOptions
): void {
  if (editor.isDestroyed) return;

  const {
    replaceRange,
    replaceTriggerToken = true,
    trailingSpace = true,
  } = options ?? {};

  const { from: selFrom, to: selTo } = editor.state.selection;
  let from: number;
  let to: number;

  if (replaceRange) {
    from = replaceRange.from;
    to = replaceRange.to;
  } else if (replaceTriggerToken) {
    ({ from, to } = getPromptComposerTokenRangeBeforePos(editor, selFrom));
  } else {
    from = selFrom;
    to = selTo;
  }

  const chain = editor.chain().focus().deleteRange({ from, to });

  if (typeof content === 'string') {
    chain.insertContentAt(from, trailingSpace ? `${content} ` : content);
  } else {
    chain.insertContentAt(from, content);
    if (trailingSpace) {
      chain.insertContent(' ');
    }
  }

  chain.run();

  queueMicrotask(() => {
    editor.view.dom.ownerDocument?.defaultView
      ?.getSelection?.()
      ?.collapseToEnd();
  });
}

function setPromptComposerEditorText(
  editor: Editor,
  text: string,
  options?: { focus?: boolean; atEnd?: boolean }
) {
  if (editor.isDestroyed) return;
  editor.commands.setContent(promptComposerParagraphDoc(text));

  if (options?.focus) {
    editor.commands.focus(options.atEnd === false ? 'start' : 'end');
  } else if (options?.atEnd !== false) {
    queueMicrotask(() => {
      editor.view.dom.ownerDocument?.defaultView
        ?.getSelection?.()
        ?.collapseToEnd();
    });
  }
}

export function createPromptComposerHandle(
  editor: Editor
): PromptComposerHandle {
  return {
    insertAtCaret: (content, options) =>
      insertPromptComposerContentAtCaret(editor, content, options),
    focus: () => {
      editor.commands.focus();
    },
    reset: () => {
      editor.chain().clearContent().focus().run();
    },
    getText: () => editor.getText(),
    setContent: (text, options) => {
      setPromptComposerEditorText(editor, text, options);
    },
    getEditor: () => editor,
  };
}
