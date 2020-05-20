function hexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
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

function getRGB(color) {
  if (/^rgb/.test(color)) return color.replace(/^rgb?\(|\)$/g, '');
  return hexToRGB(color);
}

export function getColorVariants(name, color) {
  const rgb = getRGB(color);

  return new Array(9).fill(1).map((n, index) => {
    const i = index + 1;
    return `--${name}-${i * 100}: rgba(${rgb}, .${i});`;
  });
}
