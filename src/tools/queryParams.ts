export function parseQueryParams() {
  if (!location.search) return {};
  return location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((acc, part) => {
      const [key, val] = part.split('=');
      let value = decodeURI(val) as any;

      if (!val) value = true;
      else if (/^\{.+\}$/.test(value)) value = JSON.parse(value);
      else if (value.indexOf(',') > -1) value = val.split(',');

      return { ...acc, [key]: value };
    }, {});
}

export function stringifyQueryParams(params) {
  const entries = Object.entries(params);

  if (!entries.length) return '';

  const plain = entries.reduce((acc, [key, value]) => {
    if ([undefined, null].indexOf(value) > -1) return acc;

    const val = Array.isArray(value)
      ? value.join(',')
      : typeof value === 'object'
      ? JSON.stringify(value)
      : value;

    return [...acc, `${key}=${val}`];
  }, []);

  return `?${plain.join('&')}`;
}
