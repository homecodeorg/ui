import { useEffect, useRef } from 'react';
import Time from 'timen';

import app from 'docs/App/store';

function initGradientCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const rotationSpeed = 0.01;
  let rotation = 0;
  let prevTimestamp = null;
  let prevTheme;

  let currentGradient = createRandomGradient(ctx),
    targetGradient = createRandomGradient(ctx),
    t = 1,
    step = 20,
    duration = 500;

  function randomColor() {
    const isLightTheme = app.theme === 'light';
    const maxBrightness = isLightTheme ? 225 : 51; // (255 * 0.2) to limit the brightness to 20%
    const minDarkness = isLightTheme ? 204 : 20; // (255 * 0.8) to limit the darkness to 80%
    const r = Math.floor(
      Math.random() * (maxBrightness - minDarkness + 1) + minDarkness
    );
    const g = Math.floor(
      Math.random() * (maxBrightness - minDarkness + 1) + minDarkness
    );
    const b = Math.floor(
      Math.random() * (maxBrightness - minDarkness + 1) + minDarkness
    );
    return `rgb(${r},${g},${b})`;
  }

  function createRandomGradient(ctx, angle = 0) {
    const x1 = canvas.width / 2 + (Math.cos(angle) * canvas.width) / 2,
      y1 = canvas.height / 2 + (Math.sin(angle) * canvas.height) / 2,
      x2 = canvas.width / 2 - (Math.cos(angle) * canvas.width) / 2,
      y2 = canvas.height / 2 - (Math.sin(angle) * canvas.height) / 2;
    const color1 = randomColor(),
      color2 = randomColor(),
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    gradient.colorStops = { 0: color1, 1: color2 };

    return gradient;
  }

  function updateGradient() {
    t < 1
      ? (t += step / duration)
      : ((t = 0),
        (currentGradient = targetGradient),
        (targetGradient = createRandomGradient(ctx, rotation)));
    const x1 = canvas.width / 2 + (Math.cos(rotation) * canvas.width) / 2,
      y1 = canvas.height / 2 + (Math.sin(rotation) * canvas.height) / 2,
      x2 = canvas.width / 2 - (Math.cos(rotation) * canvas.width) / 2,
      y2 = canvas.height / 2 - (Math.sin(rotation) * canvas.height) / 2;
    const ig = ctx.createLinearGradient(x1, y1, x2, y2);
    for (let offset of [0, 1]) {
      const c1 = getColor(currentGradient.colorStops[offset]),
        c2 = getColor(targetGradient.colorStops[offset]),
        ic = transitionColor(c1, c2, t);
      ig.addColorStop(offset, ic);
    }
    rotation += rotationSpeed;
    return ig;
  }

  function getColor(colorString) {
    const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/,
      match = colorString.match(regex);
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  }

  function transitionColor(c1, c2, t) {
    const r = (c1.r + (c2.r - c1.r) * t) | 0,
      g = (c1.g + (c2.g - c1.g) * t) | 0,
      b = (c1.b + (c2.b - c1.b) * t) | 0;
    return `rgb(${r}, ${g}, ${b})`;
  }

  function draw(timestamp) {
    if (prevTimestamp === null) prevTimestamp = timestamp;
    const elapsedTime = timestamp - prevTimestamp;
    const isThemeChanged = prevTheme !== app.theme;

    if (isThemeChanged) {
      prevTheme = app.theme;
      duration = 10;
      Time.after(100, () => (duration = 500));
    }

    if (elapsedTime >= step || isThemeChanged) {
      prevTimestamp = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = updateGradient();
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      initGradientCanvas(canvasRef.current);
    }
  }, []);

  return <canvas ref={canvasRef} />;
}
