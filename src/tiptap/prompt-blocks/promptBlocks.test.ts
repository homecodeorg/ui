import { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';

import { createPromptBlocksExtension, isInPromptBlock } from '.';
import { promptBlocksDoc } from './promptBlocksText';

function makeEditor(content: object | string = '') {
  return new Editor({
    extensions: [
      StarterKit.configure({ link: false, orderedList: false }),
      ...createPromptBlocksExtension({ quoteClassName: 'quote' }),
    ],
    content: typeof content === 'string' ? `<p>${content}</p>` : content,
  });
}

/** Simulates typing, so input rules run. */
function type(editor: Editor, text: string) {
  const { view } = editor;
  for (const ch of text) {
    const { from, to } = view.state.selection;
    const handled = view.someProp('handleTextInput', f =>
      f(view, from, to, ch, () => view.state.tr.insertText(ch, from, to))
    );
    if (!handled) view.dispatch(view.state.tr.insertText(ch, from, to));
  }
}

/** Top-level node names, without StarterKit's trailing empty paragraph. */
const topTypes = (editor: Editor) => {
  const names: string[] = [];
  editor.state.doc.forEach(n => names.push(n.type.name));
  const last = editor.state.doc.lastChild;
  if (names.length > 1 && last?.type.name === 'paragraph' && !last.content.size)
    names.pop();
  return names;
};

const text = (editor: Editor) => editor.getText().trimEnd();

describe('prompt blocks text', () => {
  const roundTrip = (text: string) => {
    const editor = makeEditor(promptBlocksDoc(text));
    const out = editor.getText();
    editor.destroy();
    return out;
  };

  it('keeps plain text as one paragraph', () => {
    expect(promptBlocksDoc('a\nb\n\nc').content).toHaveLength(1);
    expect(roundTrip('a\nb\n\nc')).toBe('a\nb\n\nc');
  });

  it('turns a selection quote into a locked quote and keeps the text', () => {
    const text = 'Look:\n\n> first\n>\n> second\n\n';
    const doc = promptBlocksDoc(text);
    expect(doc.content!.map(n => n.type)).toEqual([
      'paragraph',
      'promptQuote',
      'paragraph',
    ]);
    expect(doc.content![1].attrs!.text).toBe('first\n\nsecond');
    expect(roundTrip(text)).toBe(text);
  });

  it('turns "- " lines into one bullet list', () => {
    const text = 'Todo:\n\n- one\n- two';
    expect(promptBlocksDoc(text).content!.map(n => n.type)).toEqual([
      'paragraph',
      'bulletList',
    ]);
    expect(roundTrip(text)).toBe(text);
  });
});

describe('typing in the composer', () => {
  let editor: Editor;
  afterEach(() => editor.destroy());

  it('"- " starts a bullet list that reads back as markdown', () => {
    editor = makeEditor();
    type(editor, '- milk');
    expect(topTypes(editor)).toEqual(['bulletList']);
    expect(isInPromptBlock(editor.state)).toBe(true);
    editor.commands.splitListItem('listItem');
    type(editor, 'eggs');
    expect(text(editor)).toBe('- milk\n- eggs');
  });

  it('"> " quote stays editable until the caret leaves, then locks', () => {
    editor = makeEditor();
    type(editor, '> said this');
    expect(topTypes(editor)).toEqual(['blockquote']);
    expect(text(editor)).toBe('> said this');

    // Leave the quote for the line after it.
    editor.view.dispatch(
      editor.state.tr.setSelection(
        TextSelection.create(editor.state.doc, editor.state.doc.content.size - 1)
      )
    );
    expect(topTypes(editor)).toEqual(['promptQuote']);
    type(editor, 'reply');
    expect(editor.getText()).toBe('> said this\n\nreply');
  });

  it('an empty quote turns back into an empty line when left', () => {
    editor = makeEditor({
      type: 'doc',
      content: [{ type: 'paragraph' }, { type: 'paragraph' }],
    });
    editor.commands.setTextSelection(1);
    type(editor, '> ');
    expect(editor.state.doc.firstChild!.type.name).toBe('blockquote');
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    expect(editor.state.doc.firstChild!.type.name).toBe('paragraph');
    expect(text(editor)).toBe('');
  });

  it('pasted "> " lines become a locked quote', () => {
    // jsdom has no ClipboardEvent; pasteText only needs an Event.
    (globalThis as any).ClipboardEvent ??= class extends Event {};
    editor = makeEditor();
    editor.view.pasteText('> a\n> b\n\nmine');
    expect(topTypes(editor)).toEqual(['promptQuote', 'paragraph']);
    expect(text(editor)).toBe('> a\n> b\n\nmine');
  });
});

describe('after Shift+Enter', () => {
  let editor: Editor;
  afterEach(() => editor.destroy());

  it('"> " on a new line of a paragraph starts a quote', () => {
    editor = makeEditor();
    type(editor, 'context');
    editor.commands.setHardBreak();
    type(editor, '> quoted');
    expect(topTypes(editor)).toEqual(['paragraph', 'blockquote']);
    expect(text(editor)).toBe('context\n\n> quoted');
  });

  it('"- " on a new line of a paragraph starts a list', () => {
    editor = makeEditor();
    type(editor, 'todo');
    editor.commands.setHardBreak();
    type(editor, '- one');
    expect(topTypes(editor)).toEqual(['paragraph', 'bulletList']);
    expect(text(editor)).toBe('todo\n\n- one');
  });
});
