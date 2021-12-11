const LABEL = ['', 'k', 'M', 'B'];

function stringify(number) {
  if (typeof number === 'string') return number.match(/\d/g).join('');
  return String(number);
}

export const format = {
  short(number: number | string, lv = 0): string {
    const numStr = stringify(number);
    const level = Math.floor((numStr.length - 1) / 3);

    if (level === 0) return numStr;

    const label = LABEL[level];
    const num = numStr.slice(0, -level * 3);

    return `${num}${label}`;
  },
  sections(number: number | string, splitter = ' '): string {
    const [whole, fractional] = stringify(number).split('.');
    let result = whole.replace(/\B(?=(\d{3})+(?!\d))/g, splitter);

    if (fractional !== undefined) result = `${result}.${fractional}`;

    return result;
  },
};

export const zero = num => num || 0;
