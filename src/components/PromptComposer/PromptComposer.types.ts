import type { Editor } from '@tiptap/core';
import type { HTMLAttributes } from 'react';

import type {
  SlashCommandItem,
  SlashOnItemCommand,
} from '../../tiptap/slash-mention';

export type Props = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  placeholder?: string;
  slashCommandItems?: SlashCommandItem[];
  onSlashItemCommand?: SlashOnItemCommand;
  prefillMessage?: string | null;
  /** Staged attachment count - Enter can submit even when text empty. */
  attachmentsCount?: number;
  /** Mobile usually sets false so Enter inserts newline. */
  allowEnterSubmit?: boolean;
  /** Called when user presses Enter to submit. */
  onSubmit?: (text: string, editor: Editor) => void;
  /** Called on every transaction with plain text value. */
  onChange?: (text: string, editor: Editor) => void;
};

export type PromptComposerProps = Props;
