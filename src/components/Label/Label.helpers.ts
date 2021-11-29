import C from './Label.constants.json';

function getBottomOffset(size = 's') {
  if (size === 'l') return 4;
  if (size === 'm') return 2;
  return 0;
}

export function getLabelClipPath(left, width, size = 's') {
  const offset = 10;
  const A = left - C.LABEL_PADDING;
  // @ts-ignore
  const B =
    width === 0 ? 0 : left + width * C.LABEL_MULTIPLIER + C.LABEL_PADDING;
  const cutWidth = 5 + getBottomOffset(size);
  const min = `-${offset}px`;
  const max = `calc(100% + ${offset}px)`;
  const points = [
    [min, min],
    [min, max],
    [max, max],
    [max, min],
    [`${B}px`, min],
    [`${B}px`, `${cutWidth - 1}px`],
    [`${B - 1}px`, `${cutWidth}px`],
    [`${A + 1}px`, `${cutWidth}px`],
    [`${A}px`, `${cutWidth - 1}px`],
    [`${A}px`, min],
  ]
    .map(coords => coords.join(' '))
    .join(', \n');

  console.log(points);

  return `polygon(${points})`;
}
