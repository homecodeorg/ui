import React from 'react';

import { Button } from 'uilib/components/Button/Button';
import { Link } from 'uilib/components/Router/Link/Link';
import { Table } from 'uilib/components/Table/Table';
import { Tooltip } from 'uilib/components/Tooltip/Tooltip';

import S from './FormattedText.styl';
import type { FormattedTextProps } from './FormattedText.types';

type InjectionResult = {
  elem: React.ReactNode;
  index: number;
  length: number;
} | null;

function findJsonEndExclusive(content: string, start: number): number {
  const first = content[start];
  if (first !== '{' && first !== '[') return -1;
  const stack: string[] = first === '{' ? ['}'] : [']'];
  let i = start + 1;
  let inString = false;
  let escape = false;
  while (i < content.length && stack.length > 0) {
    const c = content[i];
    if (inString) {
      if (escape) escape = false;
      else if (c === '\\') escape = true;
      else if (c === '"') inString = false;
      i++;
      continue;
    }
    if (c === '"') {
      inString = true;
      i++;
      continue;
    }
    if (c === '{') {
      stack.push('}');
      i++;
      continue;
    }
    if (c === '[') {
      stack.push(']');
      i++;
      continue;
    }
    if (c === '}' || c === ']') {
      if (c !== stack[stack.length - 1]) return -1;
      stack.pop();
      i++;
      continue;
    }
    i++;
  }
  return stack.length > 0 ? -1 : i;
}

function applyInjectors(
  text: string,
  injectors: Array<(content: string) => InjectionResult>,
): React.ReactNode[] {
  let result: React.ReactNode[] = [text];
  injectors.forEach(fn => {
    let i = 0;
    while (i < result.length) {
      const item = result[i];
      if (typeof item === 'string') {
        const res = fn(item);
        if (!res) {
          i++;
          continue;
        }
        const { elem, index, length } = res;
        if (index >= 0) {
          const before = item.substring(0, index);
          const after = item.substring(index + length);
          result.splice(i, 1, before, elem, after);
          if (after.length > 0) continue;
        }
      }
      i++;
    }
  });
  return result;
}

export function FormattedText({
  text,
  className,
  onButtonClick,
}: FormattedTextProps) {
  const injectLines = (content: string): InjectionResult => {
    const matches = content.match(/(^|\n)---[ \t]*(?:\n|$)/);
    if (!matches) return null;
    return {
      elem: <div className={S.line} />,
      index: matches.index!,
      length: matches[0].length,
    };
  };

  const injectBullet = (content: string): InjectionResult => {
    const matches = content.match(/(\n|^)([ \t]*)(-|\*|\+)\s/);
    if (!matches) return null;
    return {
      elem: (
        <>
          {matches[1] === '\n' && <br />}
          <div className={S.bullet} />
        </>
      ),
      index: matches.index!,
      length: matches[0].length,
    };
  };

  const injectNumbered = (content: string): InjectionResult => {
    const matches = content.match(/(\n|^)([ \t]*)(\d+)\.\s+/);
    if (!matches) return null;
    return {
      elem: (
        <>
          {matches[1] === '\n' && <br />}
          <span className={S.numberedIndex}>{matches[3]}.</span>
        </>
      ),
      index: matches.index!,
      length: matches[0].length,
    };
  };

  const injectBold = (content: string): InjectionResult => {
    const matches = content.match(/\*\*(.*?)\*\*/);
    if (!matches) return null;
    return {
      elem: <strong>{matches[1]}</strong>,
      index: matches.index!,
      length: matches[0].length,
    };
  };

  const injectItalic = (content: string): InjectionResult => {
    const matches = content.match(/\*(.*?)\*/);
    if (!matches) return null;
    return {
      elem: <em>{matches[1]}</em>,
      index: matches.index!,
      length: matches[0].length,
    };
  };

  const injectCodeBlock = (content: string): InjectionResult => {
    const multiline = content.match(/```(\w+)?[\s\n]*([\s\S]*?)```/);
    if (multiline) {
      return {
        elem: <code className={S.codeBlock}>{multiline[2].trim()}</code>,
        index: multiline.index!,
        length: multiline[0].length,
      };
    }
    const inline = content.match(/`([^`\n]+)`/);
    if (!inline) return null;
    return {
      elem: <code className={S.codeInline}>{inline[1]}</code>,
      index: inline.index!,
      length: inline[0].length,
    };
  };

  const injectPrettyJson = (content: string): InjectionResult => {
    let searchFrom = 0;
    while (searchFrom < content.length) {
      let start = -1;
      for (let j = searchFrom; j < content.length; j++) {
        if (content[j] === '{' || content[j] === '[') {
          start = j;
          break;
        }
      }
      if (start < 0) return null;
      const endExclusive = findJsonEndExclusive(content, start);
      if (endExclusive < 0) {
        searchFrom = start + 1;
        continue;
      }
      const slice = content.slice(start, endExclusive);
      try {
        const parsed = JSON.parse(slice);
        return {
          elem: (
            <pre className={S.jsonPre}>{JSON.stringify(parsed, null, 2)}</pre>
          ),
          index: start,
          length: slice.length,
        };
      } catch {
        searchFrom = start + 1;
      }
    }
    return null;
  };

  const injectLinks = (content: string): InjectionResult => {
    const markdown = content.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (markdown) {
      let url = markdown[2];
      if (url.startsWith('www.')) url = `https://${url}`;
      return {
        elem: (
          <Tooltip content={url} direction="top">
            <Link href={url} inline target="_blank">
              {markdown[1]}
            </Link>
          </Tooltip>
        ),
        index: markdown.index!,
        length: markdown[0].length,
      };
    }
    const bareDomainTlds =
      'com|org|net|edu|gov|mil|int|info|biz|co|io|ai|app|dev|me|tv|cc|ly|sh|so|gg|fm|ws|xyz|tech|cloud|store|online|site|shop|blog|news|link|page|uk|us|ca|de|fr|jp|cn|ru|br|in|au|it|es|nl|se|no|fi|pl|ch|be|at|dk|cz|gr|hu|ie|pt|ro|tr|kr|mx|za|sg|hk|tw|nz|il|ae|ua';
    const matches = content.match(
      new RegExp(
        `(https?:\\/\\/[^\\s<>"']+|www\\.[^\\s<>"']+|[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\\.(?:${bareDomainTlds})\\b[^\\s<>"']*)`,
        'i',
      ),
    );
    if (!matches) return null;
    let url = matches[0];
    if (url.startsWith('www.')) url = `https://${url}`;
    return {
      elem: (
        <Tooltip content={url} direction="top">
          <Link href={url} inline target="_blank">
            {matches[0]}
          </Link>
        </Tooltip>
      ),
      index: matches.index!,
      length: matches[0].length,
    };
  };

  const injectBreaks = (content: string): InjectionResult => {
    const index = content.indexOf('\n');
    if (index < 0) return null;
    return {
      elem: <br />,
      index,
      length: 1,
    };
  };

  const injectButtons = (content: string): InjectionResult => {
    const matches = content.match(/\[(.*?):(.*?)\|([^\]]+)\]/);
    if (!matches) return null;
    const [data, label] = matches[0]
      .replace('[', '')
      .replace(']', '')
      .split('|');
    const [varName, value] = data.split(':');
    return {
      elem: (
        <Button
          variant="default"
          size="s"
          round
          onClick={
            onButtonClick
              ? () => onButtonClick({ text: label, [varName]: value })
              : undefined
          }
        >
          {label}
        </Button>
      ),
      index: matches.index!,
      length: matches[0].length,
    };
  };

  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

  const processCellContent = (value: string, depth = 0): React.ReactNode[] =>
    applyInjectors(value, [
      injectCodeBlock,
      injectPrettyJson,
      ...(depth === 0
        ? [
            (content: string): InjectionResult => {
              const matches = content.match(/(^|\n)(#{1,6})\s+([^\n]+)/);
              if (!matches) return null;
              const Tag = headingTags[Math.min(matches[2].length, 6) - 1];
              return {
                elem: React.createElement(
                  Tag,
                  {},
                  ...processCellContent(matches[3], depth + 1),
                ),
                index: matches.index!,
                length: matches[0].length,
              };
            },
          ]
        : []),
      injectLines,
      injectLinks,
      injectBold,
      injectItalic,
      injectBullet,
      injectNumbered,
      injectButtons,
    ]);

  const injectHeading = (content: string): InjectionResult => {
    const matches = content.match(/(^|\n)(#{1,6})\s+([^\n]+)/);
    if (!matches) return null;
    const Tag = headingTags[Math.min(matches[2].length, 6) - 1];
    return {
      elem: React.createElement(Tag, {}, ...processCellContent(matches[3], 1)),
      index: matches.index!,
      length: matches[0].length,
    };
  };

  const injectTables = (content: string): InjectionResult => {
    const withSep = content.match(
      /(\n|^)(\|[^\n]+\|[ \t]*\n)(\|[\t :-]+(?:\|[\t :-]+)*\|[ \t]*\n)((?:\|[^\n]+\|[ \t]*\n?)+)/,
    );
    const withoutSep = withSep
      ? null
      : content.match(/(\n|^)(\|[^\n]+\|[ \t]*\n)((?:\|[^\n]+\|[ \t]*\n?)+)/);
    const matches = withSep || withoutSep;
    if (!matches) return null;
    const hasSeparator = Boolean(withSep);
    const headerRow = matches[2].trim();
    const dataRows = (hasSeparator ? matches[4] : matches[3]).trim();
    const headers = headerRow.split('|').map(cell => cell.trim()).slice(1, -1);
    if (headers.length === 0) return null;
    const rows = dataRows
      .split('\n')
      .map(row => row.trim())
      .filter(row => row.startsWith('|') && row.endsWith('|'))
      .map(row => row.split('|').map(cell => cell.trim()).slice(1, -1))
      .filter(row => row.length > 0);
    if (rows.length === 0) return null;
    const maxCols = Math.max(headers.length, ...rows.map(row => row.length));
    const paddedHeaders = [
      ...headers,
      ...Array(maxCols - headers.length).fill(''),
    ];
    const columns = paddedHeaders.map((header, idx) => ({
      id: `col-${idx}`,
      label: processCellContent(header),
      dataField: `col-${idx}`,
      render: (data: Record<string, unknown>) =>
        processCellContent((data[`col-${idx}`] as string) || ''),
    }));
    const tableData = rows.map((row, rowIdx) => {
      const rowData: Record<string, string> = { id: `row-${rowIdx}` };
      paddedHeaders.forEach((_, colIdx) => {
        rowData[`col-${colIdx}`] = row[colIdx] || '';
      });
      return rowData;
    });
    return {
      elem: (
        <Table
          size="s"
          variant="plain"
          columns={columns}
          data={tableData}
          className={S.table}
        />
      ),
      index: matches.index! + (matches[1]?.length || 0),
      length: matches[0].length - (matches[1]?.length || 0),
    };
  };

  return (
    <div className={className}>
      {applyInjectors(text, [
        injectTables,
        injectCodeBlock,
        injectPrettyJson,
        injectHeading,
        injectLines,
        injectLinks,
        injectBold,
        injectItalic,
        injectBullet,
        injectNumbered,
        injectButtons,
        injectBreaks,
      ])}
    </div>
  );
}
