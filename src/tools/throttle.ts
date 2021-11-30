export default function throttle(func: Function, wait: number) {
  var throttling = false;
  var result;

  return function () {
    var args = Array.prototype.slice.call(arguments);

    if (!throttling) {
      throttling = true;
      result = func.apply(this, arguments);
      setTimeout(function () {
        throttling = false;
      }, wait);
    }

    return result;
  };
}
