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
    Math.max(first, itemsCount - 1),
    Math.floor((scrollTop + clientHeight) / itemHeight + overlapCount)
  );

  return { first, last };
}

export function getHeight({
  totalCount,
  itemHeight,
  offsetBefore = 0,
  offsetAfter = 0,
}) {
  return totalCount * itemHeight + offsetBefore + offsetAfter;
}
