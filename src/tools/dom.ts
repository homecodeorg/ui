import { getScrollParent } from 'tools/getScrollParent';

export function getCoords(elem) {
  const box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    left: box.left + window.pageXOffset,
  };
}

export function hasParent(elem, parentElem) {
  const isEqual = elem === parentElem;

  if (isEqual || elem.nodeName === 'HTML') {
    return isEqual;
  }

  return hasParent(elem.parentNode, parentElem);
}

export function scrollTo(elem, left, top) {
  if ('scrollBehavior' in document.documentElement.style) {
    elem.scrollTo({ left, top, behavior: 'smooth' });
    return;
  }

  elem.scrollTo(left, top);
}

export function scrollIntoView(elem) {
  if (!elem) return;

  const scrollParent = getScrollParent(elem);

  if (!scrollParent) return;

  const halfParentHeight = scrollParent.clientHeight / 2;
  const halfElemHeight = elem.offsetHeight / 2;
  const to = elem.offsetTop + halfElemHeight - halfParentHeight;

  if (to > 0) scrollTo(scrollParent, 0, to);
}

export function watchControllerFlag() {
  const classes = document.body.classList;

  document.addEventListener('mousedown', () => {
    classes.remove('keyboard');
    classes.add('mouse');
  });

  document.addEventListener('keydown', () => {
    classes.remove('mouse');
    classes.add('keyboard');
  });

  classes.add('mouse');
}
