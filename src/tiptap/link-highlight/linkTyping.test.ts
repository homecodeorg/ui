import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import { NonInclusiveLink } from './nonInclusiveLink';

const URL = 'https://youtu.be/dQw4w9WgXcQ';

function typeAt(editor: Editor, pos: number, text: string) {
  const { view } = editor;
  view.dispatch(view.state.tr.insertText(text, pos));
}

function linkTexts(editor: Editor) {
  const texts: string[] = [];
  editor.state.doc.descendants(node => {
    if (node.isText && node.marks.some(m => m.type.name === 'link')) {
      texts.push(node.text!);
    }
  });
  return texts;
}

describe('typing next to an auto-linked URL', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [StarterKit.configure({ link: false }), NonInclusiveLink],
      content: `<p><a href="${URL}">${URL}</a></p>`,
    });
  });

  afterEach(() => editor.destroy());

  it('keeps text typed before the link out of the link', () => {
    typeAt(editor, 1, 'hello ');
    expect(editor.getText()).toBe(`hello ${URL}`);
    expect(linkTexts(editor)).toEqual([URL]);
  });

  it('keeps text typed right against the link start out of the link', () => {
    typeAt(editor, 1, 'hello');
    expect(editor.getText()).toBe(`hello${URL}`);
    expect(linkTexts(editor)).toEqual([URL]);
  });

  it('keeps text typed after the link out of the link', () => {
    typeAt(editor, URL.length + 1, ' later');
    expect(editor.getText()).toBe(`${URL} later`);
    expect(linkTexts(editor)).toEqual([URL]);
  });
});
