import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { type AnyExtension, type Editor } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
  DEFAULT_CHAT_SLASH_ITEMS,
  createSlashMentionExtension,
} from '../../tiptap/slash-mention';
import type {
  SlashCommandItem,
  SlashOnItemCommand,
} from '../../tiptap/slash-mention';
import {
  promptComposerSafeEditorDom,
  syncPromptComposerHeight,
} from './PromptComposer.helpers';
import {
  PROMPT_COMPOSER_EMPTY_DOC,
  promptComposerParagraphDoc,
} from './promptComposerDoc';

export type UsePromptComposerEditorOptions = {
  disabled: boolean;
  placeholder?: string;
  slashCommandItems?: SlashCommandItem[];
  onSlashItemCommand?: SlashOnItemCommand;
  prefillMessage?: string | null;
  attachmentsCount?: number;
  allowEnterSubmit: boolean;
  onSubmit?: (text: string, editor: Editor) => void;
  onChange?: (text: string, editor: Editor) => void;
};

export type UsePromptComposerEditorResult = {
  editor: Editor | null;
  text: string;
  trimmedText: string;
};

const PROMPT_COMPOSER_EDITOR_CLASS = 'promptComposerEditor';
const PROMPT_COMPOSER_EMPTY_EDITOR_CLASS = 'promptComposerEmptyEditor';
const PROMPT_COMPOSER_EMPTY_NODE_CLASS = 'promptComposerEmptyNode';

export function usePromptComposerEditor({
  disabled,
  placeholder,
  slashCommandItems,
  onSlashItemCommand,
  prefillMessage,
  attachmentsCount = 0,
  allowEnterSubmit,
  onSubmit,
  onChange,
}: UsePromptComposerEditorOptions): UsePromptComposerEditorResult {
  const slashOpenRef = useRef(false);
  const onSlashItemCommandRef = useRef(onSlashItemCommand);
  onSlashItemCommandRef.current = onSlashItemCommand;

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editorRef = useRef<Editor | null>(null);

  const suggestionActiveUpdater = useCallback((active: boolean) => {
    slashOpenRef.current = active;
  }, []);

  const slashItemsFingerprint = JSON.stringify(slashCommandItems ?? null);
  const slashItemsStable = useMemo(
    () => slashCommandItems ?? DEFAULT_CHAT_SLASH_ITEMS,
    [slashCommandItems, slashItemsFingerprint]
  );

  const placeholderText = useMemo(() => {
    if (placeholder === undefined || placeholder === null) {
      return 'Type a message...';
    }
    const text = String(placeholder).trim();
    return text === '' ? 'Type a message...' : text;
  }, [placeholder]);

  const ariaLabelComposer = useMemo(() => {
    if (placeholder === undefined || placeholder === null) return 'Message';
    const text = String(placeholder).trim();
    return text === '' ? 'Message' : text;
  }, [placeholder]);

  const extensions = useMemo(() => {
    const exts: AnyExtension[] = [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: placeholderText,
        showOnlyWhenEditable: true,
        emptyEditorClass: PROMPT_COMPOSER_EMPTY_EDITOR_CLASS,
        emptyNodeClass: PROMPT_COMPOSER_EMPTY_NODE_CLASS,
      }),
    ];

    if (slashItemsStable.length > 0) {
      exts.push(
        createSlashMentionExtension({
          items: slashItemsStable,
          suggestionPlacement: 'above',
          onSuggestionUiActiveChange: suggestionActiveUpdater,
          onItemCommand: ctx => onSlashItemCommandRef.current?.(ctx) === true,
        })
      );
    }

    return exts;
  }, [placeholderText, slashItemsStable, suggestionActiveUpdater]);

  const [text, setText] = useState('');

  const editorDomRef = useRef<HTMLElement | null>(null);
  const bindEditorDom = useCallback(({ editor }: { editor: Editor }) => {
    const nextText = editor.getText();
    setText(nextText);
    queueMicrotask(() => {
      const dom = promptComposerSafeEditorDom(editor);
      if (!dom) return;
      editorDomRef.current = dom;
      syncPromptComposerHeight(dom, nextText);
    });
  }, []);

  const trimmedText = text.trim();
  const trimmedTextRef = useRef(trimmedText);
  trimmedTextRef.current = trimmedText;

  const attachmentsCountRef = useRef(attachmentsCount);
  attachmentsCountRef.current = attachmentsCount;

  const allowEnterSubmitRef = useRef(allowEnterSubmit);
  allowEnterSubmitRef.current = allowEnterSubmit;

  const handleEditorKeyDown = useCallback(
    (_view: unknown, event: KeyboardEvent) => {
      if (
        !(
          event.key === 'Enter' &&
          !event.shiftKey &&
          !event.metaKey &&
          !event.ctrlKey
        )
      ) {
        return false;
      }

      if (!allowEnterSubmitRef.current) return false;
      if (slashOpenRef.current) return false;
      if (!trimmedTextRef.current && attachmentsCountRef.current === 0) {
        return false;
      }

      event.preventDefault();
      const activeEditor = editorRef.current;
      if (!activeEditor) return true;
      onSubmitRef.current?.(activeEditor.getText(), activeEditor);
      return true;
    },
    []
  );

  const editor = useEditor(
    {
      extensions,
      content: PROMPT_COMPOSER_EMPTY_DOC,
      editable: !disabled,
      immediatelyRender: true,
      editorProps: {
        attributes: {
          spellcheck: 'true',
          'aria-label': ariaLabelComposer,
          class: PROMPT_COMPOSER_EDITOR_CLASS,
        },
        handleKeyDown: handleEditorKeyDown,
      },
      onTransaction: ({ editor: activeEditor }) => {
        const dom = promptComposerSafeEditorDom(activeEditor);
        const nextText = activeEditor.getText();
        if (dom) {
          syncPromptComposerHeight(dom, nextText);
        }
        setText(nextText);
        onChangeRef.current?.(nextText, activeEditor);
      },
      onCreate: bindEditorDom,
    },
    [extensions, bindEditorDom, ariaLabelComposer, handleEditorKeyDown]
  );

  editorRef.current = editor;

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    const bind = () => {
      editorDomRef.current = promptComposerSafeEditorDom(editor);
    };
    bind();
    let rafId: number | null = null;
    if (typeof window !== 'undefined') {
      rafId = window.requestAnimationFrame(bind);
    }
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || prefillMessage == null) return;

    const current = editor.getText();
    const next = prefillMessage;
    if (current === next) return;

    if (next === '') {
      editor.commands.setContent(PROMPT_COMPOSER_EMPTY_DOC);
    } else {
      editor.commands.setContent(promptComposerParagraphDoc(next));
    }

    setText(editor.getText());
    queueMicrotask(() => {
      const dom = promptComposerSafeEditorDom(editor);
      if (dom) syncPromptComposerHeight(dom, editor.getText());
      if (!disabled && !editor.isDestroyed) {
        editor.chain().focus('end').run();
      }
    });
  }, [editor, prefillMessage, disabled]);

  useLayoutEffect(() => {
    if (!editor) return;
    const dom = promptComposerSafeEditorDom(editor);
    if (!dom) return;
    syncPromptComposerHeight(dom, text);
  }, [editor, text]);

  return {
    editor,
    text,
    trimmedText,
  };
}
