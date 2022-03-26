export function getLastIndex(
  scrollTop,
  clientHeight,
  itemHeight,
  overlapCount
) {
  return Math.floor((scrollTop + clientHeight) / itemHeight + overlapCount);
}

// Returns indexes of first and last items to be rendered
export function getIndexes({
  scrollTop,
  clientHeight,
  itemHeight,
  itemsCount,
  overlapCount,
}) {
  const first = Math.max(0, Math.floor(scrollTop / itemHeight - overlapCount));
  const last = Math.min(
    Math.max(first, itemsCount + overlapCount - 1),
    getLastIndex(scrollTop, clientHeight, itemHeight, overlapCount)
  );

  return { first, last };
}

export function getHeight({
  itemsCount,
  itemHeight,
  offsetBefore = 0,
  offsetAfter = 0,
}) {
  return itemsCount * itemHeight + offsetBefore + offsetAfter;
}
