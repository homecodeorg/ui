import {
  Extension,
  Node,
  getTextBetween,
  getTextSerializersFromSchema,
  wrappingInputRule,
} from '@tiptap/core';
import { BulletList } from '@tiptap/extension-list';
import type { Node as PMNode, ResolvedPos, Schema } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';

import { PROMPT_QUOTE_NODE, promptQuoteMarkdown } from './promptBlocksText';

type TextSerializers = ReturnType<typeof getTextSerializersFromSchema>;
const serializersBySchema = new WeakMap<Schema, TextSerializers>();

function textSerializers(schema: Schema): TextSerializers {
  let serializers = serializersBySchema.get(schema);
  if (!serializers) {
    serializers = getTextSerializersFromSchema(schema);
    serializersBySchema.set(schema, serializers);
  }
  return serializers;
}

/** Text of a textblock, with mention chips and hard breaks as text. */
function inlineText(node: PMNode, schema: Schema): string {
  return getTextBetween(
    node,
    { from: 0, to: node.content.size },
    { blockSeparator: '\n', textSerializers: textSerializers(schema) }
  );
}

/**
 * Lines of a (draft) blockquote: one per paragraph, a pasted quote's own
 * lines, and list items as `- ` lines.
 */
function blockquoteLines(node: PMNode, schema: Schema): string {
  const lines: string[] = [];
  node.forEach(child => {
    if (child.type.name === PROMPT_QUOTE_NODE) {
      lines.push(String(child.attrs.text ?? ''));
    } else if (child.type.name === 'bulletList') {
      lines.push(bulletListMarkdown(child, schema));
    } else if (child.isTextblock) {
      lines.push(inlineText(child, schema));
    } else {
      lines.push(blockquoteLines(child, schema));
    }
  });
  return lines.join('\n');
}

function bulletListMarkdown(
  list: PMNode,
  schema: Schema,
  indent = ''
): string {
  const lines: string[] = [];
  list.forEach(item => {
    let first = true;
    item.forEach(child => {
      if (child.type.name === 'bulletList') {
        lines.push(bulletListMarkdown(child, schema, `${indent}  `));
        return;
      }
      const text = child.isTextblock
        ? inlineText(child, schema)
        : child.type.name === 'blockquote'
          ? promptQuoteMarkdown(blockquoteLines(child, schema))
          : child.type.name === PROMPT_QUOTE_NODE
            ? promptQuoteMarkdown(String(child.attrs.text ?? ''))
            : child.textContent;
      const prefix = first ? `${indent}- ` : `${indent}  `;
      lines.push(
        text
          .split('\n')
          .map((line, i) => (i === 0 ? prefix + line : `${indent}  ${line}`))
          .join('\n')
      );
      first = false;
    });
  });
  return lines.join('\n');
}

export type CreatePromptBlocksExtensionOptions = {
  /** Class of a locked quote and of a quote being typed. */
  quoteClassName?: string;
  /** Class of a bullet list. */
  listClassName?: string;
};

/** Only `- ` starts a list: `* ` and `+ ` stay text, as getText() writes `- `. */
const DashBulletList = BulletList.extend({
  addInputRules() {
    return [wrappingInputRule({ find: /^\s*-\s$/, type: this.type })];
  },
});

function inQuote($pos: ResolvedPos): boolean {
  for (let d = $pos.depth; d > 0; d -= 1) {
    if ($pos.node(d).type.name === 'blockquote') return true;
  }
  return false;
}

/** The innermost list item or quote the position is in, if any. */
function promptBlockAt($pos: ResolvedPos): string | null {
  for (let d = $pos.depth; d > 0; d -= 1) {
    const name = $pos.node(d).type.name;
    if (name === 'listItem' || name === 'blockquote') return name;
  }
  return null;
}

/**
 * Locked quote: a read-only block holding the quoted text. It can be
 * selected and deleted, not edited.
 */
function createPromptQuoteNode(className?: string) {
  return Node.create({
    name: PROMPT_QUOTE_NODE,
    group: 'block',
    atom: true,
    selectable: true,
    draggable: false,

    addAttributes() {
      return {
        text: {
          default: '',
          parseHTML: el => el.textContent ?? '',
          rendered: false,
        },
      };
    },

    parseHTML() {
      return [{ tag: 'div[data-prompt-quote]' }];
    },

    renderHTML({ node }) {
      return [
        'div',
        {
          'data-prompt-quote': '',
          contenteditable: 'false',
          ...(className ? { class: className } : {}),
        },
        String(node.attrs.text ?? ''),
      ];
    },

    renderText({ node }) {
      return promptQuoteMarkdown(String(node.attrs.text ?? ''));
    },
  });
}

const lockQuotesKey = new PluginKey('promptLockQuotes');

/**
 * Markdown-style lines in the prompt composer:
 * - `- ` at the start of a line starts a bullet list (StarterKit's list);
 * - `> ` starts a quote that stays editable while the caret is in it and
 *   turns into a read-only quote block once the caret leaves.
 *
 * `getText()` gives both back as markdown (`- item`, `> line`).
 * Brings its own bullet list: use StarterKit with `bulletList: false` and
 * `listItem` and `blockquote` enabled.
 */
export function createPromptBlocksExtension({
  quoteClassName,
  listClassName,
}: CreatePromptBlocksExtensionOptions = {}) {
  const PromptBlocks = Extension.create({
    name: 'promptBlocks',

    extendNodeSchema(extension) {
      if (extension.name === 'bulletList') {
        return {
          toText: ({ node }: { node: PMNode }) =>
            bulletListMarkdown(node, node.type.schema),
        };
      }
      if (extension.name === 'blockquote') {
        return {
          toText: ({ node }: { node: PMNode }) =>
            promptQuoteMarkdown(blockquoteLines(node, node.type.schema)),
        };
      }
      return {};
    },

    addProseMirrorPlugins() {
      const { editor } = this;
      return [
        new Plugin({
          key: lockQuotesKey,
          appendTransaction: (transactions, oldState, state) => {
            const docChanged = transactions.some(tr => tr.docChanged);
            if (!docChanged && !transactions.some(tr => tr.selectionSet)) {
              return null;
            }
            // A caret move can only leave a quote it was in.
            if (
              !docChanged &&
              !inQuote(oldState.selection.$from) &&
              !inQuote(oldState.selection.$to)
            ) {
              return null;
            }
            const quoteType = state.schema.nodes[PROMPT_QUOTE_NODE];
            const paragraphType = state.schema.nodes.paragraph;
            if (!quoteType || !paragraphType) return null;

            const { from, to } = state.selection;
            const drafts: { pos: number; node: PMNode }[] = [];
            state.doc.descendants((node, pos) => {
              // Quotes sit at the top level or in list items, never inline.
              if (node.type.name !== 'blockquote') return !node.isTextblock;
              const end = pos + node.nodeSize;
              if (!(from >= pos && to <= end)) drafts.push({ pos, node });
              return false;
            });
            if (drafts.length === 0) return null;

            const tr = state.tr;
            // Right to left, so earlier positions stay valid.
            for (const { pos, node } of drafts.reverse()) {
              const text = blockquoteLines(node, state.schema);
              const replacement = text.trim()
                ? quoteType.create({ text })
                : paragraphType.create();
              tr.replaceWith(pos, pos + node.nodeSize, replacement);
            }
            // Kept out of undo history: undo can't reopen a locked quote (it
            // would lock again at once, as the caret is outside it).
            return tr.setMeta('addToHistory', false);
          },
          props: {
            // StarterKit's `- ` / `> ` rules need the start of a paragraph;
            // this also takes a line started with Shift+Enter (a hard break).
            handleTextInput: (view, from, to, text) => {
              if (text !== ' ' || from !== to || view.composing) return false;
              const { doc } = view.state;
              if (from < 2) return false;
              const marker = doc.textBetween(from - 1, from);
              if (marker !== '>' && marker !== '-') return false;
              const $marker = doc.resolve(from - 1);
              if ($marker.parent.type.name !== 'paragraph') return false;
              if ($marker.nodeBefore?.type.name !== 'hardBreak') return false;
              const inBlock = promptBlockAt($marker);
              // In a quote, `> ` stays text; in a list, `- ` is the next item.
              if (inBlock === 'blockquote') return false;
              if (inBlock === 'listItem' && marker === '>') return false;

              const start = (chain: ReturnType<typeof editor.chain>) => {
                const run = chain.deleteRange({ from: from - 2, to: from });
                if (inBlock === 'listItem') return run.splitListItem('listItem');
                run.splitBlock();
                return marker === '>'
                  ? run.wrapIn('blockquote')
                  : run.toggleBulletList();
              };
              // Handled once the doc changed, even if a later step failed:
              // the marker is gone, so the default insert would land wrong.
              const before = view.state.doc;
              start(editor.chain()).run();
              return view.state.doc !== before;
            },
          },
        }),
      ];
    },
  });

  return [
    createPromptQuoteNode(quoteClassName),
    DashBulletList.configure({
      HTMLAttributes: listClassName ? { class: listClassName } : {},
    }),
    PromptBlocks,
  ];
}

/** True when the caret is in a bullet list or a quote being typed. */
export function isInPromptBlock(state: {
  selection: { $from: ResolvedPos };
}): boolean {
  return promptBlockAt(state.selection.$from) !== null;
}
