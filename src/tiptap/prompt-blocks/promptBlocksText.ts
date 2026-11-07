import type { JSONContent } from '@tiptap/core';

/** Node name of a locked (read-only) quote block. */
export const PROMPT_QUOTE_NODE = 'promptQuote';

const QUOTE_LINE = /^>(?: (.*)|)$/;
const TOP_BULLET_LINE = /^- (.*)$/;
const BULLET_LINE = /^( *)- (.*)$/;
/** Indented line under a list item: a nested item or a continued line. */
const LIST_CHILD_LINE = /^ {2,}\S/;

/** Markdown quote of `text`: `> ` per line, `>` for a blank line. */
export function promptQuoteMarkdown(text: string): string {
  return text
    .split('\n')
    .map(line => (line.trim() ? `> ${line}` : '>'))
    .join('\n');
}

export function hasPromptBlockLines(text: string): boolean {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .some(line => QUOTE_LINE.test(line) || TOP_BULLET_LINE.test(line));
}

const textContent = (text: string): JSONContent[] =>
  text ? [{ type: 'text', text }] : [];

const paragraph = (text: string): JSONContent => ({
  type: 'paragraph',
  content: textContent(text),
});

type Group =
  | { kind: 'quote'; lines: string[] }
  | { kind: 'bullet'; lines: string[] }
  | { kind: 'plain'; lines: string[] };

/** Bullet groups keep their raw lines (indents included) for buildList. */
function groupLines(lines: string[]): Group[] {
  const groups: Group[] = [];
  for (const line of lines) {
    const last = groups[groups.length - 1];
    const quote = line.match(QUOTE_LINE);
    const inList = last?.kind === 'bullet';
    const bullet =
      !quote &&
      (TOP_BULLET_LINE.test(line) || (inList && LIST_CHILD_LINE.test(line)));
    const kind = quote ? 'quote' : bullet ? 'bullet' : 'plain';
    const value = quote ? (quote[1] ?? '') : line;
    if (last && last.kind === kind) last.lines.push(value);
    else groups.push({ kind, lines: [value] } as Group);
  }
  return groups;
}

/**
 * Bullet list from `- item` lines at `indent` spaces. A `- ` line two
 * spaces deeper starts a nested list; other deeper lines continue the
 * item's text (what getText() writes for a multi-line item).
 */
function buildList(lines: string[], indent = 0): JSONContent {
  const items: { text: string; nested: string[] }[] = [];
  for (const line of lines) {
    const bullet = line.match(BULLET_LINE);
    const item = items[items.length - 1];
    if ((bullet && bullet[1].length === indent) || !item) {
      items.push({ text: bullet ? bullet[2] : line.trim(), nested: [] });
      continue;
    }
    const nestedBullet = bullet && bullet[1].length === indent + 2;
    if (item.nested.length > 0 || nestedBullet) item.nested.push(line);
    else item.text += `\n${line.slice(indent + 2)}`;
  }
  return {
    type: 'bulletList',
    content: items.map(item => ({
      type: 'listItem',
      content: [
        paragraph(item.text),
        ...(item.nested.length ? [buildList(item.nested, indent + 2)] : []),
      ],
    })),
  };
}

/**
 * Blocks for plain `text` with `> ` lines as locked quotes and `- ` lines as
 * a bullet list. `getText()` of the result gives `text` back (blocks are
 * joined by a blank line, list items by a newline).
 *
 * `plainLines`: `'joined'` keeps a run of other lines in one paragraph with
 * newlines (how the composer prefill always worked), `'split'` makes one
 * paragraph per line (how a plain-text paste works).
 */
export function promptBlocksFromText(
  text: string,
  { plainLines = 'joined' }: { plainLines?: 'joined' | 'split' } = {}
): JSONContent[] {
  const groups = groupLines(text.replace(/\r\n?/g, '\n').split('\n'));
  const blocks: JSONContent[] = [];

  groups.forEach((group, i) => {
    if (group.kind === 'quote') {
      blocks.push({
        type: PROMPT_QUOTE_NODE,
        attrs: { text: group.lines.join('\n') },
      });
      return;
    }
    if (group.kind === 'bullet') {
      blocks.push(buildList(group.lines));
      return;
    }

    // The blank line next to a quote or list is the block separator.
    const lines = [...group.lines];
    if (i > 0 && lines[0] === '') lines.shift();
    if (i < groups.length - 1 && lines[lines.length - 1] === '') lines.pop();
    if (lines.length === 0) return;

    // Like ProseMirror's own paste, blank lines only separate paragraphs.
    if (plainLines === 'split') {
      blocks.push(...lines.filter(line => line.trim()).map(paragraph));
    } else blocks.push(paragraph(lines.join('\n')));
  });

  return blocks.length ? blocks : [paragraph('')];
}

export function promptBlocksDoc(text: string): JSONContent {
  return { type: 'doc', content: promptBlocksFromText(text) };
}
