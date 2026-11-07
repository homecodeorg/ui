import { Editor } from '@tiptap/core';
import { closeHistory } from '@tiptap/pm/history';
import { TextSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';

import { createPromptBlocksExtension, isInPromptBlock } from '.';
import { promptBlocksDoc } from './promptBlocksText';

function makeEditor(content: object | string = '') {
  return new Editor({
    extensions: [
      StarterKit.configure({
        link: false,
        orderedList: false,
        bulletList: false,
      }),
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
    // A doc ending on a list gets an empty line after it.
    return text.endsWith('\n\n') ? out : out.replace(/\n\n$/, '');
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
      'paragraph',
    ]);
    expect(roundTrip(text)).toBe(text);
  });

  it('never ends on a quote, so the caret has a line after it', () => {
    const doc = promptBlocksDoc('> q');
    expect(doc.content!.map(n => n.type)).toEqual(['promptQuote', 'paragraph']);
    const editor = makeEditor(doc);
    editor.commands.focus('end');
    expect(editor.state.selection.$from.parent.type.name).toBe('paragraph');
    editor.destroy();
  });

  it('keeps item text that follows a nested list, in order', () => {
    const item = promptBlocksDoc('- a\n  - b\n  c').content![0].content![0];
    expect(item.content!.map(n => n.type)).toEqual([
      'paragraph',
      'bulletList',
      'paragraph',
    ]);
    expect(roundTrip('- a\n  - b\n  c')).toBe('- a\n  - b\n  c');
  });

  it('reads back nested and multi-line list items', () => {
    const text = '- a\n  - b\n    more b\n- c';
    const list = promptBlocksDoc(text).content![0];
    expect(list.type).toBe('bulletList');
    expect(list.content).toHaveLength(2);
    expect(list.content![0].content![1].type).toBe('bulletList');
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

describe('review fixes', () => {
  let editor: Editor;
  afterEach(() => editor.destroy());

  it('Shift+Enter then "- " inside a list item starts the next item', () => {
    editor = makeEditor();
    type(editor, '- milk');
    editor.commands.setHardBreak();
    type(editor, '- x');
    expect(topTypes(editor)).toEqual(['bulletList']);
    expect(text(editor)).toBe('- milk\n- x');
  });

  it('a quote with a quote inside keeps its text when locked', () => {
    editor = makeEditor({
      type: 'doc',
      content: [{ type: 'paragraph' }, { type: 'paragraph' }],
    });
    editor.commands.setTextSelection(1);
    type(editor, '> mine');
    editor.commands.insertContent({
      type: 'promptQuote',
      attrs: { text: 'a\nb' },
    });
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    expect(editor.state.doc.firstChild!.type.name).toBe('promptQuote');
    expect(editor.state.doc.firstChild!.attrs.text).toContain('a\nb');
  });
});

describe('review round 2', () => {
  let editor: Editor;
  afterEach(() => editor.destroy());

  it('"* " and "+ " stay text', () => {
    editor = makeEditor();
    type(editor, '* note');
    expect(topTypes(editor)).toEqual(['paragraph']);
    expect(text(editor)).toBe('* note');
  });


  it('undo after a quote locks takes back the quote typing', () => {
    editor = makeEditor({
      type: 'doc',
      content: [{ type: 'paragraph' }, { type: 'paragraph' }],
    });
    editor.commands.setTextSelection(1);
    type(editor, '> said');
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    expect(topTypes(editor)).toEqual(['promptQuote']);
    editor.commands.undo();
    expect(text(editor)).not.toContain('said');
  });
});

describe('review round 3', () => {
  it('a quote with a list in it locks when the caret leaves', () => {
    const editor = makeEditor({
      type: 'doc',
      content: [{ type: 'paragraph' }, { type: 'paragraph' }],
    });
    editor.commands.setTextSelection(1);
    type(editor, '> - item');
    expect(isInPromptBlock(editor.state)).toBe(true);
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    expect(editor.state.doc.firstChild!.type.name).toBe('promptQuote');
    expect(text(editor)).toBe('> - item');
    editor.destroy();
  });
});

describe('review round 4', () => {
  let editor: Editor;
  afterEach(() => editor.destroy());

  it('a locked quote does not block undo of earlier typing', () => {
    editor = makeEditor({
      type: 'doc',
      content: [{ type: 'paragraph' }, { type: 'paragraph' }],
    });
    editor.commands.setTextSelection(3);
    type(editor, 'hello');
    editor.view.dispatch(closeHistory(editor.state.tr));
    editor.commands.setTextSelection(1);
    type(editor, '> said');
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    expect(editor.state.doc.firstChild!.type.name).toBe('promptQuote');
    // Undo walks back through the quote (lock, input rule, `> `), then on.
    for (let i = 0; i < 5 && text(editor).includes('hello'); i += 1) {
      editor.commands.undo();
    }
    expect(text(editor)).not.toContain('hello');
  });

  it('a selection reaching into a draft quote keeps it editable', () => {
    editor = makeEditor('abc');
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    editor.commands.setHardBreak();
    type(editor, '> said');
    const end = editor.state.selection.from;
    editor.view.dispatch(
      editor.state.tr.setSelection(
        TextSelection.create(editor.state.doc, end, 2)
      )
    );
    expect(topTypes(editor)).toContain('blockquote');
    expect(editor.state.selection.empty).toBe(false);
  });

  it('Shift+Enter "- " in a quote starts a list in it', () => {
    editor = makeEditor();
    type(editor, '> one');
    editor.commands.setHardBreak();
    type(editor, '- two');
    let hasList = false;
    editor.state.doc.firstChild!.descendants(n => {
      if (n.type.name === 'bulletList') hasList = true;
    });
    expect(hasList).toBe(true);
    expect(text(editor)).toBe('> one\n> - two');
  });
});

describe('review round 5', () => {
  it('an empty bullet or quote gives no text', () => {
    const editor = makeEditor();
    type(editor, '- ');
    expect(editor.getText().trim()).toBe('');
    editor.commands.setContent('<p></p>');
    type(editor, '> ');
    expect(editor.getText().trim()).toBe('');
    editor.destroy();
  });

  it('bullets split by a blank line stay one list', () => {
    const doc = promptBlocksDoc('- a\n\n- b');
    expect(doc.content!.map(n => n.type)).toEqual(['bulletList', 'paragraph']);
    expect(doc.content![0].content).toHaveLength(2);
  });
});
