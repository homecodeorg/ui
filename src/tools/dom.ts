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

export const isTouch = () => 'ontouchstart' in window;
