export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  keys.forEach(key => {
    if (key in obj) result[key] = obj[key];
  });

  return result;
}

export function omit(obj, keys) {
  const result = { ...obj };

  keys.forEach(key => {
    delete result[key];
  });

  return result;
}
