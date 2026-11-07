import type { JSONContent } from '@tiptap/core';

/** Node name of a locked (read-only) quote block. */
export const PROMPT_QUOTE_NODE = 'promptQuote';

const QUOTE_LINE = /^>(?: (.*)|)$/;
const TOP_BULLET_LINE = /^- (.*)$/;
const BULLET_LINE = /^( *)- (.*)$/;
/** Indented line under a list item: a nested item or a continued line. */
const LIST_CHILD_LINE = /^ {2,}\S/;

/**
 * Markdown quote of `text`: `> ` per line, `>` for a blank line, nothing for
 * an empty quote (so `> ` alone does not count as a prompt).
 */
export function promptQuoteMarkdown(text: string): string {
  if (!text.trim()) return '';
  return text
    .split('\n')
    .map(line => (line.trim() ? `> ${line}` : '>'))
    .join('\n');
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
  type Part = { nested: string[] } | { text: string };
  const items: { text: string; parts: Part[] }[] = [];
  for (const line of lines) {
    const bullet = line.match(BULLET_LINE);
    const item = items[items.length - 1];
    if ((bullet && bullet[1].length === indent) || !item) {
      items.push({ text: bullet ? bullet[2] : line.trim(), parts: [] });
      continue;
    }
    const lineIndent = line.match(/^ */)![0].length;
    const last = item.parts[item.parts.length - 1];
    const startsNested = bullet && lineIndent === indent + 2;
    if (startsNested || (last && 'nested' in last && lineIndent > indent + 2)) {
      if (last && 'nested' in last) last.nested.push(line);
      else item.parts.push({ nested: [line] });
      continue;
    }
    const value = line.slice(Math.min(lineIndent, indent + 2));
    // Text at the item's own indent continues it, after a nested list too.
    if (!last) item.text += `\n${value}`;
    else if ('text' in last) last.text += `\n${value}`;
    else item.parts.push({ text: value });
  }
  return {
    type: 'bulletList',
    content: items.map(item => ({
      type: 'listItem',
      content: [
        paragraph(item.text),
        ...item.parts.map(part =>
          'nested' in part
            ? buildList(part.nested, indent + 2)
            : paragraph(part.text)
        ),
      ],
    })),
  };
}

/**
 * Blocks for plain `text` with `> ` lines as locked quotes and `- ` lines as
 * a bullet list. `getText()` of the result gives `text` back (blocks are
 * joined by a blank line, list items by a newline).
 *
 * Other lines stay in one paragraph with newlines, as the composer prefill
 * always worked. A doc never ends on a quote or list: an empty line follows,
 * so the caret can go there instead of selecting the read-only quote.
 */
export function promptBlocksFromText(text: string): JSONContent[] {
  const groups = groupLines(text.replace(/\r\n?/g, '\n').split('\n'));
  const blocks: JSONContent[] = [];

  groups.forEach((group, i) => {
    if (group.kind === 'quote') {
      // A bare `>` quotes nothing: keep it as an empty line.
      if (!group.lines.join('').trim()) {
        blocks.push(paragraph(''));
        return;
      }
      blocks.push({
        type: PROMPT_QUOTE_NODE,
        attrs: { text: group.lines.join('\n') },
      });
      return;
    }
    if (group.kind === 'bullet') {
      const list = buildList(group.lines);
      // `- a`, blank line, `- b` is one list, as in markdown.
      const prev = blocks[blocks.length - 1];
      if (prev?.type === 'bulletList') {
        prev.content = [...(prev.content ?? []), ...(list.content ?? [])];
      } else blocks.push(list);
      return;
    }

    // The blank line next to a quote or list is the block separator.
    const lines = [...group.lines];
    if (i > 0 && lines[0] === '') lines.shift();
    if (i < groups.length - 1 && lines[lines.length - 1] === '') lines.pop();
    if (lines.length === 0) return;

    blocks.push(paragraph(lines.join('\n')));
  });

  if (blocks[blocks.length - 1]?.type !== 'paragraph') blocks.push(paragraph(''));
  return blocks;
}

export function promptBlocksDoc(text: string): JSONContent {
  return { type: 'doc', content: promptBlocksFromText(text) };
}
