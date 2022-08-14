import Time from 'timen';

type Params = { trailing?: boolean; skipFirst?: boolean };

export default function throttle(
  fn: (...args: any[]) => any,
  ms: number,
  { trailing, skipFirst }: Params = {}
): any {
  let isCooldown = skipFirst;
  let isCalledAtCooldown = false;

  function runNext(...args) {
    Time.after(ms, () => {
      isCooldown = false;

      if (trailing && isCalledAtCooldown) {
        fn.apply(this, args);
        isCalledAtCooldown = false;
      }
    });
  }

  return function throttled(...args) {
    if (isCooldown) {
      if (!isCalledAtCooldown && skipFirst && trailing)
        runNext.apply(this, args);

      isCalledAtCooldown = true;
    } else {
      isCooldown = true;
      isCalledAtCooldown = false;

      fn.apply(this, args);
      runNext.apply(this, args);
    }
  };
}
