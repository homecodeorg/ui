// Safari and Firefox not fire focus on click
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
export function focusOnClick(buttonElem: HTMLButtonElement | null) {
  const ua = navigator.userAgent.toLowerCase();
  const isSafari = ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1;
  const isFirefox = /firefox/.test(ua);

  if (isSafari || isFirefox) {
    buttonElem?.focus();
  }
}
