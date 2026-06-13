import cn from 'classnames';
import { forwardRef, useImperativeHandle, useMemo } from 'react';

import { EditorContent } from '@tiptap/react';
import { Scroll } from 'uilib/components/Scroll/Scroll';

import S from './PromptComposer.styl';
import type { PromptComposerProps } from './PromptComposer.types';
import {
  type PromptComposerHandle,
  createPromptComposerHandle,
} from './promptComposerInsert';
import { usePromptComposerEditor } from './usePromptComposerEditor';

export type {
  PromptComposerHandle,
  PromptComposerInsertOptions,
} from './promptComposerInsert';

export const PromptComposer = forwardRef<
  PromptComposerHandle,
  PromptComposerProps
>(function PromptComposer(
  {
    disabled = false,
    placeholder,
    className,
    slashCommandItems,
    slashSuggestionPlacement,
    onSlashItemCommand,
    prefillMessage,
    attachmentsCount = 0,
    allowEnterSubmit = true,
    onSubmit,
    onChange,
    scrollProps = {},
  },
  ref
) {
  const { editor } = usePromptComposerEditor({
    disabled,
    placeholder,
    slashCommandItems,
    slashSuggestionPlacement,
    onSlashItemCommand,
    prefillMessage,
    attachmentsCount,
    allowEnterSubmit,
    onSubmit,
    onChange,
  });

  const unavailableHandle = useMemo<PromptComposerHandle>(
    () => ({
      insertAtCaret: () => undefined,
      focus: () => undefined,
      reset: () => undefined,
      setContent: () => undefined,
      getText: () => '',
      getEditor: () => {
        throw new Error('PromptComposer editor is not ready yet');
      },
      openSlashSuggestion: () => undefined,
    }),
    []
  );

  useImperativeHandle(
    ref,
    () => (editor ? createPromptComposerHandle(editor) : unavailableHandle),
    [editor, unavailableHandle]
  );

  return (
    <div
      className={cn(S.root, className)}
      data-disabled={disabled ? 'true' : 'false'}
    >
      <Scroll y fadeSize="s" {...scrollProps} className={S.scroller}>
        <EditorContent editor={editor} className={S.editorMount} />
      </Scroll>
    </div>
  );
});
