import type { JSONContent } from '@tiptap/core';

import { promptBlocksDoc } from '../../tiptap/prompt-blocks/promptBlocksText';

export const PROMPT_COMPOSER_EMPTY_DOC: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

/**
 * Doc for prefilled text: `> ` lines become read-only quotes and `- ` lines a
 * bullet list; other text stays as it was.
 */
export function promptComposerTextDoc(text: string): JSONContent {
  return promptBlocksDoc(text);
}
