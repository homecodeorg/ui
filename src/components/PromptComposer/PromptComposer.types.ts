import type { Editor } from '@tiptap/core';
import type { HTMLAttributes } from 'react';

import type {
  PromptMentionConfig,
  SlashCommandItem,
  SlashGetItems,
  SlashOnItemCommand,
  SlashSuggestionPlacement,
} from '../../tiptap/slash-mention';
import type { Props as ScrollProps } from '../Scroll/Scroll.types';

export type Props = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSubmit' | 'onChange'
> & {
  disabled?: boolean;
  placeholder?: string;
  slashCommandItems?: SlashCommandItem[];
  /** Slash menu vertical placement; defaults to above chat input. */
  slashSuggestionPlacement?: SlashSuggestionPlacement;
  onSlashItemCommand?: SlashOnItemCommand;
  /**
   * Extra mention triggers (e.g. `@` files). `/` still comes from
   * slashCommandItems when provided.
   */
  mentionConfigs?: PromptMentionConfig[];
  /** Convenience for `@` file mentions (merged into mentionConfigs). */
  atMentionItems?: SlashCommandItem[];
  atMentionGetItems?: SlashGetItems;
  onAtItemCommand?: SlashOnItemCommand;
  prefillMessage?: string | null;
  /** Staged attachment count - Enter can submit even when text empty. */
  attachmentsCount?: number;
  /** Mobile usually sets false so Enter inserts newline. */
  allowEnterSubmit?: boolean;
  /** Called when user presses Enter to submit. */
  onSubmit?: (text: string, editor: Editor) => void;
  /** Called on every transaction with plain text value. */
  onChange?: (text: string, editor: Editor) => void;
  scrollProps?: Partial<ScrollProps>;
};

export type PromptComposerProps = Props;
