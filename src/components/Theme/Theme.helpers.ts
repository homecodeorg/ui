function hexToRGB(str: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hex = str.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) return null;

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ].join(',');
}

const mix = (c1, c2, val) => Math.floor(c1 * (1 - val) + c2 * val);
export function mixColor(color1, color2, val = 1) {
  const c1 = (/^#/.test(color1) ? hexToRGB(color1) : color1)
    .split(',')
    .map(n => parseInt(n, 10));
  const c2 = (/^#/.test(color2) ? hexToRGB(color2) : color2)
    .split(',')
    .map(n => parseInt(n, 10));
  const rgb = [
    mix(c1[0], c2[0], val),
    mix(c1[1], c2[1], val),
    mix(c1[2], c2[2], val),
  ].join(',');

  return `rgb(${rgb})`;
}

export function rgba(color, transparency) {
  return `rgba(${getRGB(color)},${transparency})`;
}

export function getRGB(color) {
  if (/^rgb/.test(color)) return color.replace(/^rgb?\(|\)$/g, '');
  return hexToRGB(color);
}

const getConfigColor = val => (Array.isArray(val) ? val[0] : val);

const colorMods = {
  alpha: (color, val) => [rgba(color, val / 1000), `alpha-${val}`],
  mix: (color1, [color2, val], config) => [
    mixColor(color1, getConfigColor(config[color2]), val / 1000),
    `mix-${color2}-${val}`,
  ],
};

type ColorMods = { [name: string]: number[] };
type ColorConfig = [color: string, mods: ColorMods];
type ColorsConfig = {
  [name: string]: ColorConfig;
};

export function colorsConfigToVars(config: ColorsConfig) {
  return Object.entries(config).reduce((acc, [name, val]) => {
    const colorName = `${name}-color`;

    if (Array.isArray(val)) {
      const color = val[0];
      const mods = val[1];

      acc[colorName] = color;

      if (typeof mods === 'object' && mods !== null) {
        Object.entries(mods || {}).forEach(([mod, vals]) => {
          vals.forEach(val => {
            const [res, prefix] = colorMods[mod](color, val, config);
            acc[`${colorName}-${prefix}`] = res;
          });
        });
      }
    } else {
      acc[colorName] = val;
    }

    return acc;
  }, {});
}
