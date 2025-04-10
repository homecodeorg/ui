import { env } from 'uilib/tools';

const DEFAULT_OFFSET_SIZE = 3;

export function getCoords(
  elem,
  direction = 'bottom',
  {
    left = /^right/.test(direction)
      ? DEFAULT_OFFSET_SIZE
      : /^left/.test(direction)
      ? -DEFAULT_OFFSET_SIZE
      : 0,
    top = /^bottom/.test(direction)
      ? DEFAULT_OFFSET_SIZE
      : /^top/.test(direction)
      ? -DEFAULT_OFFSET_SIZE
      : 0,
  } = {}
) {
  const box = elem.getBoundingClientRect();

  return {
    top: box.top + window.scrollY + top,
    left: box.left + window.scrollX + left,
    // right: box.right + window.scrollX + right,
    // bottom: box.bottom + window.scrollY + bottom,
  };
}

export function hasParent(elem, parentElem) {
  const isEqual = elem === parentElem;

  if (isEqual || elem.nodeName === 'HTML') {
    return isEqual;
  }

  return hasParent(elem.parentNode, parentElem);
}

export enum INTERACTION_MODE {
  POINTER = 'pointer',
  KEYBOARD = 'keyboard',
}

let interactionMode = INTERACTION_MODE.POINTER;

export const getInteractionMode = () => interactionMode;

export function watchControllerFlag() {
  const classes = document.body.classList;
  const onPointerMove = () => {
    classes.remove(INTERACTION_MODE.KEYBOARD);
    classes.add(INTERACTION_MODE.POINTER);
  };

  ['pointerdown', 'pointermove'].forEach(event => {
    document.addEventListener(event, onPointerMove, true);
  });

  document.addEventListener('keydown', () => {
    classes.remove(INTERACTION_MODE.POINTER);
    classes.add(INTERACTION_MODE.KEYBOARD);
  });

  classes.add(interactionMode);
}

export const isTouch = () => env.isBrowser && 'ontouchstart' in window;
