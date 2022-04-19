const ls = window.localStorage;

export default {
  get(key) {
    let result = ls.getItem(key);

    try {
      result = JSON.parse(result);
    } catch (e) {
      console.warn(e?.message ?? 'failed to parse', `: "${result}"`);
    }

    return result;
  },

  set(key, val) {
    if (!val) {
      this.remove(key);
      return;
    }

    const item = typeof val === 'object' ? JSON.stringify(val) : val;
    ls.setItem(key, item);
  },

  remove(key) {
    ls.removeItem(key);
  },

  clear() {
    ls.clear();
  },
};
