import Time from 'timen';

export default function debounce(
  fn: (...args: unknown[]) => any,
  ms: number
): any {
  let unsubscribeFn: () => void;

  return function debounced(...args) {
    unsubscribeFn?.();
    unsubscribeFn = Time.after(ms, () => fn.apply(this, args));
  };
}
