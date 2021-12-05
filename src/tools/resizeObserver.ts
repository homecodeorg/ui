import Time from 'timen';
import compare from 'compareq';
import pick from 'lodash.pick';

import { addUniq, spliceWhere } from './array';

const ITEMS = new Map();
const NATIVE_OBSERVERS = new Map();
const IS_NATIVE = 'ResizeObserver' in window;
const TIMEOUT = 500;
const SIZE_FIELDS = ['offsetWidth', 'offsetHeight'];

function check() {
  ITEMS.forEach((item, elem) => {
    const { sizes, listeners } = item;
    const newSizes = pick(elem, SIZE_FIELDS);

    if (!compare(newSizes, sizes)) {
      item.sizes = newSizes;
      listeners.forEach(cb => cb(newSizes, elem));
    }
  });

  run();
}

function run() {
  if (ITEMS.size > 0) Time.after(TIMEOUT, check);
}

export function observe(elem, cb) {
  if (IS_NATIVE) {
    const observer = new ResizeObserver(cb);
    observer.observe(elem);
    NATIVE_OBSERVERS.set(elem, observer);
    return;
  }

  const data = ITEMS.get(elem);

  if (data) {
    addUniq(data.listeners, cb);
    return;
  }

  ITEMS.set(elem, {
    sizes: pick(elem, SIZE_FIELDS),
    listeners: [cb],
  });

  if (ITEMS.size === 1) run();
}

export function unobserve(elem, cb?) {
  if (IS_NATIVE) {
    const observer = NATIVE_OBSERVERS.get(elem);
    if (!observer) return;
    observer.unobserve(elem);
    NATIVE_OBSERVERS.delete(elem);
    return;
  }

  const data = ITEMS.get(elem);

  if (!cb || data?.listeners.indexOf(cb) === -1) return;

  if (data.listeners.length === 1) ITEMS.delete(elem);
  else spliceWhere(data.listeners, cb);
}
