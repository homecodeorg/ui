import type { Editor } from '@tiptap/core';

/**
 * Placeholder text for the composer's empty paragraphs. Only a wholly empty
 * composer shows it: a quote or list with an empty line after it already is
 * content, so it keeps no hint.
 */
export function promptComposerPlaceholder(text: string) {
  return ({ editor }: { editor: Editor }) => (editor.isEmpty ? text : '');
}
