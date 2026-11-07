import type { JSONContent } from '@tiptap/core';

/** Node name of a locked (read-only) quote block. */
export const PROMPT_QUOTE_NODE = 'promptQuote';

const QUOTE_LINE = /^>(?: (.*)|)$/;
const BULLET_LINE = /^- (.*)$/;

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
    .some(line => QUOTE_LINE.test(line) || BULLET_LINE.test(line));
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

function groupLines(lines: string[]): Group[] {
  const groups: Group[] = [];
  for (const line of lines) {
    const quote = line.match(QUOTE_LINE);
    const bullet = quote ? null : line.match(BULLET_LINE);
    const kind = quote ? 'quote' : bullet ? 'bullet' : 'plain';
    const value = quote ? (quote[1] ?? '') : bullet ? bullet[1] : line;
    const last = groups[groups.length - 1];
    if (last && last.kind === kind) last.lines.push(value);
    else groups.push({ kind, lines: [value] } as Group);
  }
  return groups;
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
      blocks.push({
        type: 'bulletList',
        content: group.lines.map(line => ({
          type: 'listItem',
          content: [paragraph(line)],
        })),
      });
      return;
    }

    // The blank line next to a quote or list is the block separator.
    const lines = [...group.lines];
    if (i > 0 && lines[0] === '') lines.shift();
    if (i < groups.length - 1 && lines[lines.length - 1] === '') lines.pop();
    if (lines.length === 0) return;

    if (plainLines === 'split') blocks.push(...lines.map(paragraph));
    else blocks.push(paragraph(lines.join('\n')));
  });

  return blocks.length ? blocks : [paragraph('')];
}

export function promptBlocksDoc(text: string): JSONContent {
  return { type: 'doc', content: promptBlocksFromText(text) };
}
