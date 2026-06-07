import type { JSONContent } from '@tiptap/core';

export const PROMPT_COMPOSER_EMPTY_DOC: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export function promptComposerParagraphDoc(text: string): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: text ? [{ type: 'text', text }] : [],
      },
    ],
  };
}
