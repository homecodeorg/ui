import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { LiveEditor } from 'react-live';

import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';

import { useTheme } from 'uilib';

import S from '../Code.styl';
import STORE from '../store';

type Props = {
  id: string;
  code: string;
  showLineNumbers?: boolean;
};

/** Rows follow buffer `split` (aligns with react-live lines); digits only through last non-blank line. */
function linesFromSource(source: string) {
  return source.split(/\r?\n/);
}

function lastContentLineIndex(lines: string[]) {
  let last = -1;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (lines[i].trim().length > 0) {
      last = i;
      break;
    }
  }
  return last;
}

function focusCaretAtLastContentLine(pre: HTMLElement, source: string) {
  const lines = linesFromSource(source);
  const lastIdx = lastContentLineIndex(lines);
  const targetIndex = lastIdx >= 0 ? lastIdx : 0;
  const lineDivs = pre.querySelectorAll<HTMLElement>(':scope > div');
  const lineEl = lineDivs[targetIndex];

  pre.focus();
  const sel = window.getSelection();
  if (!sel) return;

  const range = document.createRange();
  if (lineEl) {
    range.selectNodeContents(lineEl);
    range.collapse(false);
  } else {
    range.selectNodeContents(pre);
    range.collapse(false);
  }
  sel.removeAllRanges();
  sel.addRange(range);
}

/** Index of the `pre > div` line hit by the event target, or -1 */
function lineIndexFromEventTarget(
  pre: HTMLElement,
  target: EventTarget | null
): number {
  let el = target as Node | null;
  while (el && el !== pre) {
    const { parentNode } = el;
    if (parentNode === pre && el instanceof HTMLElement) {
      return [...pre.querySelectorAll<HTMLElement>(':scope > div')].indexOf(el);
    }
    el = parentNode;
  }
  return -1;
}

export default function Editor({
  id,
  code,
  showLineNumbers = false,
}: Props) {
  const { theme } = useTheme();

  const [lineSource, setLineSource] = useState(code);

  useEffect(() => {
    setLineSource(code);
  }, [code, id]);

  const onChange = useCallback(newCode => {
    setLineSource(newCode);
    if (newCode !== STORE.editedCode) {
      STORE.onChange(id, newCode);
    }
  }, [id]);

  const onEditorColumnMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const pre = e.currentTarget.querySelector<HTMLElement>(
        'pre[contenteditable="true"], pre[contenteditable]'
      );
      if (!pre) return;

      const sourceLines = linesFromSource(lineSource);
      const lastIdx = lastContentLineIndex(sourceLines);

      if (!pre.contains(e.target as Node)) {
        e.preventDefault();
        focusCaretAtLastContentLine(pre, lineSource);
        return;
      }

      if (lastIdx < 0) return;

      const lineIx = lineIndexFromEventTarget(pre, e.target);
      if (lineIx > lastIdx) {
        e.preventDefault();
        focusCaretAtLastContentLine(pre, lineSource);
      }
    },
    [lineSource]
  );

  if (!code) return null;

  const bufferLines = linesFromSource(lineSource);
  const lastNumbered = lastContentLineIndex(bufferLines);
  const nRows = Math.max(1, bufferLines.length);
  const gutterDigits = String(
    lastNumbered >= 0 ? lastNumbered + 1 : 1
  ).length;

  const liveEditor = (
    <LiveEditor
      className={S.editor}
      id={id}
      code={code}
      language="typescript"
      theme={theme === 'dark' ? vsDark : vsLight}
      onChange={onChange}
    />
  );

  const editorColumn = (
    <div
      className={S.editorColumn}
      onMouseDown={onEditorColumnMouseDown}
    >
      {liveEditor}
    </div>
  );

  if (!showLineNumbers) return editorColumn;

  return (
    <div className={S.editorWithGutter}>
      <div
        className={S.lineGutter}
        style={{ minWidth: `calc(${gutterDigits + 1}ch + 12px)` }}
        aria-hidden
      >
        {Array.from({ length: nRows }, (_, i) => (
          <div className={S.lineGutterLine} key={i}>
            {lastNumbered < 0
              ? i === 0
                ? 1
                : ''
              : i <= lastNumbered
                ? i + 1
                : ''}
          </div>
        ))}
      </div>
      {editorColumn}
    </div>
  );
}
