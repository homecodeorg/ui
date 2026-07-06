export const TRIGGER_TEXT_STYLE_PROPS = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant',
  'font-stretch',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-transform',
  'text-indent',
  'text-decoration-line',
  'text-decoration-color',
  'text-decoration-style',
  'text-decoration-thickness',
  'text-underline-offset',
  'font-feature-settings',
  'font-variation-settings',
  'font-kerning',
  'font-optical-sizing',
  'font-synthesis',
  'font-variant-numeric',
  'font-variant-ligatures',
  'font-variant-caps',
  'font-variant-east-asian',
  'tab-size',
  'color',
  'word-break',
  'overflow-wrap',
  'hyphens',
] as const;

export function getTextStyleSource(triggerEl: HTMLElement): HTMLElement {
  const firstChild = triggerEl.firstElementChild;
  return firstChild instanceof HTMLElement ? firstChild : triggerEl;
}

export function applyTriggerTextStyles(
  contentEl: HTMLElement,
  sourceEl: HTMLElement
) {
  const computed = window.getComputedStyle(sourceEl);

  for (const prop of TRIGGER_TEXT_STYLE_PROPS) {
    contentEl.style.setProperty(prop, computed.getPropertyValue(prop));
  }
}

export function clearTriggerTextStyles(contentEl: HTMLElement) {
  for (const prop of TRIGGER_TEXT_STYLE_PROPS) {
    contentEl.style.removeProperty(prop);
  }
}
