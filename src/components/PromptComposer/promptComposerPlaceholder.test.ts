import { Editor } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';

import { createPromptBlocksExtension } from '../../tiptap/prompt-blocks';
import { promptBlocksDoc } from '../../tiptap/prompt-blocks/promptBlocksText';
import { promptComposerPlaceholder } from './promptComposerPlaceholder';

function makeEditor(content: object | string) {
  return new Editor({
    extensions: [
      StarterKit.configure({
        link: false,
        orderedList: false,
        bulletList: false,
      }),
      Placeholder.configure({
        placeholder: promptComposerPlaceholder('Ask me anything…'),
        emptyNodeClass: 'empty',
      }),
      ...createPromptBlocksExtension({ quoteClassName: 'quote' }),
    ],
    content: typeof content === 'string' ? `<p>${content}</p>` : content,
  });
}

/** Text each empty paragraph would show as its placeholder. */
function hints(editor: Editor): string[] {
  return [...editor.view.dom.querySelectorAll('.empty')].map(
    el => el.getAttribute('data-placeholder') ?? ''
  );
}

describe('promptComposerPlaceholder', () => {
  it('hints in an empty composer', () => {
    const editor = makeEditor('');
    expect(hints(editor)).toEqual(['Ask me anything…']);
    editor.destroy();
  });

  it('hides once there is text', () => {
    const editor = makeEditor('hello');
    expect(hints(editor)).toEqual([]);
    editor.destroy();
  });

  it('hides when only a quote has content', () => {
    const editor = makeEditor(promptBlocksDoc('> a quote\n\n'));
    // The caret sits in the empty line after the quote.
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    expect(editor.isEmpty).toBe(false);
    expect(editor.view.dom.querySelectorAll('.empty')).toHaveLength(1);
    expect(hints(editor).filter(Boolean)).toEqual([]);
    editor.destroy();
  });
});
