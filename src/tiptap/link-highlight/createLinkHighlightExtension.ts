import { Extension } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { find } from 'linkifyjs';

/**
 * Colors URLs in plain text. Unlike Link autolink, it also covers text that
 * was set programmatically, the last word before a space is typed, and URLs
 * followed by punctuation.
 */
function buildDecorations(doc: PMNode, className: string): DecorationSet {
  const decorations: Decoration[] = [];

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    for (const link of find(node.text, 'url')) {
      decorations.push(
        Decoration.inline(pos + link.start, pos + link.end, {
          class: className,
        })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
}

export function createLinkHighlightExtension(className: string) {
  const key = new PluginKey<DecorationSet>('linkHighlight');

  return Extension.create({
    name: 'linkHighlight',
    addProseMirrorPlugins() {
      return [
        new Plugin<DecorationSet>({
          key,
          state: {
            init: (_, { doc }) => buildDecorations(doc, className),
            apply: (tr, prev) =>
              tr.docChanged ? buildDecorations(tr.doc, className) : prev,
          },
          props: {
            decorations: state => key.getState(state),
          },
        }),
      ];
    },
  });
}
