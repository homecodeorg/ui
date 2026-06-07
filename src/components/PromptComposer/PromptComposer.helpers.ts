/** Keep in sync with `PromptComposer.styl` max/min heights. */
export const PROMPT_COMPOSER_MAX_HEIGHT_PX = 200;
export const PROMPT_COMPOSER_MIN_HEIGHT_PX = 40;

export function safePromptComposerEditorText(
  editor:
    | { readonly isDestroyed?: boolean; getText?: () => string }
    | null
    | undefined
): string | null {
  if (!editor || editor.isDestroyed) return null;
  try {
    return editor.getText?.() ?? null;
  } catch {
    return null;
  }
}

export function promptComposerSafeEditorDom(
  editor: { readonly isDestroyed?: boolean } | null | undefined
): HTMLElement | null {
  if (!editor || editor.isDestroyed) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dom = (editor as any).view?.dom as unknown;
    return dom instanceof HTMLElement ? dom : null;
  } catch {
    return null;
  }
}

function promptComposerFloorPx(cs: CSSStyleDeclaration): number {
  const padY =
    (Number.parseFloat(cs.paddingTop) || 0) +
    (Number.parseFloat(cs.paddingBottom) || 0);
  const fs = Number.parseFloat(cs.fontSize) || 14;
  const linePx =
    cs.lineHeight === 'normal'
      ? fs * 1.25
      : Number.parseFloat(cs.lineHeight) || fs * 1.25;

  return Math.max(PROMPT_COMPOSER_MIN_HEIGHT_PX, Math.ceil(linePx + padY));
}

/** Autosize `.ProseMirror` root: empty -> floor, text -> measured height with clamp. */
export function syncPromptComposerHeight(el: HTMLElement, text: string): void {
  const floor = promptComposerFloorPx(getComputedStyle(el));

  el.style.overflowY = 'hidden';
  let contentHeight: number;
  const empty = text.trim() === '';

  if (empty) {
    contentHeight = floor;
  } else {
    el.style.height = '0';
    contentHeight = el.scrollHeight;
  }

  const h = Math.min(
    Math.max(contentHeight, floor),
    PROMPT_COMPOSER_MAX_HEIGHT_PX
  );

  el.style.height = `${h}px`;
  el.style.overflowY =
    contentHeight > PROMPT_COMPOSER_MAX_HEIGHT_PX ? 'auto' : 'hidden';
}
