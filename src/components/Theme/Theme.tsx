const DEFAULT_CONFIG = {
  '--indent-s': '10px',
  '--indent-m': '20px',
  '--indent-l': '30px',

  '--border-radius-s': '2px',
  '--border-radius-m': '4px',
  '--border-radius-l': '6px',

  '--danger-color': '#c82c05',
};

export default function Theme({ config = {} }) {
  const vars = Object.entries({ ...DEFAULT_CONFIG, ...config })
    .map(([name, val]) => `\n${name}: ${val};`)
    .join('');

  return <style>{`:root {${vars}}`}</style>;
}
