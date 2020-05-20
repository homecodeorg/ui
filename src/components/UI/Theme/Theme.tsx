import { h } from 'preact'
import { getColorVariants } from './Theme.helpers';

const DEFAULT_CONFIG = {
  'indent-s': '10px',
  'indent-m': '20px',
  'indent-l': '30px',

  'border-radius-s': '2px',
  'border-radius-m': '4px',
  'border-radius-l': '6px',

  'warning-color': '#f6ab00',
  'danger-color': '#c82c05',
};

export default function Theme({ config = {} }) {
  const vars = Object.entries({ ...DEFAULT_CONFIG, ...config })
    .reduce((acc, [name, val]) => {
      acc.push(`--${name}: ${val};`);
      if (/-color/.test(name)) acc.push(...getColorVariants(name, val));
      return acc;
    }, [])
    .join('\n');

  return <style>{`:root {${vars}}`}</style>;
}
