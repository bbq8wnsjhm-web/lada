const canvas = document.querySelector(".kinetic-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

const TEXT = "RE081813";
const VIEW = { width: 1200, height: 420 };
const FONT_SIZE = 196;
const FONT_WEIGHT = 600;
const LETTER_SPACING = 24;
const BASELINE_Y = 240;
const LOOP_DURATION = 6.2;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FONT_STACK = '"Bahnschrift SemiCondensed", "Bahnschrift", Aptos, "Segoe UI Variable Text", sans-serif';
const TEXT_STYLE = `${FONT_WEIGHT} ${FONT_SIZE}px ${FONT_STACK}`;

let glyphs = [];
let frameId = 0;

setup();
window.addEventListener("resize", setup);

function setup() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(VIEW.width * dpr);
  canvas.height = Math.round(VIEW.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;

  glyphs = buildGlyphs();
  render(0);

  if (!REDUCED_MOTION && !frameId) {
    frameId = requestAnimationFrame(loop);
  }
}

function loop(time) {
  render(time);
  frameId = requestAnimationFrame(loop);
}

function buildGlyphs() {
  ctx.save();
  ctx.font = TEXT_STYLE;
  ctx.textBaseline = "alphabetic";

  const widths = TEXT.split("").map((char) => ctx.measureText(char).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + LETTER_SPACING * (TEXT.length - 1);
  let cursor = (VIEW.width - totalWidth) / 2;

  const items = TEXT.split("").map((char, index) => {
    const width = widths[index];
    const x = cursor + width / 2;
    const isDigit = /\d/.test(char);
    const spatialWeight = index < 2 ? index * 0.02 : Math.pow((index - 1) / (TEXT.length - 2), 1.34);
    const phase = 0.55 + index * 0.62;
    cursor += width + LETTER_SPACING;

    return {
      char,
      x,
      width,
      isDigit,
      spatialWeight,
      phase,
      ...buildGlyphMask(char, width),
    };
  });

  ctx.restore();
  return items;
}

function buildGlyphMask(char, glyphWidth) {
  const margin = 50;
  const width = Math.ceil(glyphWidth + margin * 2);
  const height = 286;
  const baseline = 210;

  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;

  const offCtx = offscreen.getContext("2d");
  offCtx.clearRect(0, 0, width, height);
  offCtx.fillStyle = "#ffffff";
  offCtx.font = TEXT_STYLE;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "alphabetic";
  offCtx.fillText(char, width / 2, baseline);

  return {
    maskCanvas: offscreen,
    maskWidth: width,
    maskHeight: height,
    maskBaseline: baseline,
  };
}

function render(time) {
  const seconds = time / 1000;
  const cycle = REDUCED_MOTION
    ? 0.78
    : 0.5 - 0.5 * Math.cos((seconds / LOOP_DURATION) * Math.PI * 2);
  const envelope = REDUCED_MOTION ? cycle : easeInOutSine(cycle);

  ctx.clearRect(0, 0, VIEW.width, VIEW.height);
  drawBackground();

  glyphs.forEach((glyph) => {
    const intensity = glyph.spatialWeight * (0.18 + envelope * 0.82);

    drawHalo(glyph, intensity, seconds);
    drawLiquidBody(glyph, intensity, seconds);

    if (glyph.isDigit) {
      drawDigitSplit(glyph, intensity, seconds);
    }

    drawBase(glyph, intensity);
  });
}

function drawBackground() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);

  const vignette = ctx.createRadialGradient(VIEW.width / 2, VIEW.height / 2 - 10, 24, VIEW.width / 2, VIEW.height / 2, 520);
  vignette.addColorStop(0, "rgba(255,255,255,0.045)");
  vignette.addColorStop(0.45, "rgba(255,255,255,0.015)");
  vignette.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
}

function drawBase(glyph, intensity) {
  ctx.save();
  ctx.font = TEXT_STYLE;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f4f4f0";
  ctx.shadowColor = "rgba(255,255,255,0.08)";
  ctx.shadowBlur = 8 + intensity * 4;
  ctx.globalAlpha = 0.96 - intensity * 0.1;
  ctx.fillText(glyph.char, glyph.x, BASELINE_Y);
  ctx.restore();
}

function drawHalo(glyph, intensity, seconds) {
  if (intensity < 0.02) {
    return;
  }

  drawStripWarp(glyph, intensity, seconds, {
    alpha: 0.045 + intensity * 0.08,
    blur: 8 + intensity * 8,
    spread: 26 + intensity * 30,
    vertical: 10 + intensity * 10,
    stretch: 0.28,
    widthBoost: 0.55,
    bias: intensity * 12,
    start: 0.18,
    freqA: 12,
    freqB: 22,
    speedA: 1.2,
    speedB: 0.9,
  });
}

function drawLiquidBody(glyph, intensity, seconds) {
  if (intensity < 0.01) {
    return;
  }

  drawStripWarp(glyph, intensity, seconds, {
    alpha: 0.08 + intensity * 0.13,
    blur: 2.2 + intensity * 4.2,
    spread: 14 + intensity * 24,
    vertical: 4 + intensity * 7,
    stretch: 0.18,
    widthBoost: 0.28,
    bias: intensity * 8,
    start: 0.22,
    freqA: 15,
    freqB: 29,
    speedA: 1.9,
    speedB: 1.25,
  });
}

function drawStripWarp(glyph, intensity, seconds, options) {
  const stripWidth = 3;
  const baseX = glyph.x - glyph.maskWidth / 2;
  const baseY = BASELINE_Y - glyph.maskBaseline;

  ctx.save();
  ctx.globalAlpha = options.alpha;
  ctx.filter = `blur(${options.blur.toFixed(2)}px)`;

  for (let sx = 0; sx < glyph.maskWidth; sx += stripWidth) {
    const xNorm = sx / Math.max(glyph.maskWidth - stripWidth, 1);
    const local = smoothstep(options.start, 1, xNorm) * intensity;

    if (local < 0.002) {
      continue;
    }

    const waveA = Math.sin(xNorm * options.freqA - seconds * options.speedA + glyph.phase);
    const waveB = Math.sin(xNorm * options.freqB + seconds * options.speedB + glyph.phase * 0.7);
    const contour = 0.7 + 0.3 * Math.sin(xNorm * 18 - seconds * 1.1 + glyph.phase * 0.5);

    const dx = options.bias + local * options.spread * (waveA * 0.6 + waveB * 0.4) * contour;
    const dy = local * options.vertical * Math.sin(xNorm * 21 + seconds * 1.5 + glyph.phase * 1.1);
    const stretchY = 1 + local * options.stretch * (0.5 + 0.5 * Math.sin(xNorm * 26 - seconds * 1.35 + glyph.phase));
    const destWidth = stripWidth * (1 + local * options.widthBoost);
    const destHeight = glyph.maskHeight * stretchY;

    ctx.drawImage(
      glyph.maskCanvas,
      sx,
      0,
      stripWidth,
      glyph.maskHeight,
      baseX + sx + dx,
      baseY - (destHeight - glyph.maskHeight) / 2 + dy,
      destWidth,
      destHeight
    );
  }

  ctx.restore();
}

function drawDigitSplit(glyph, intensity, seconds) {
  if (intensity < 0.03) {
    return;
  }

  const bands = [
    { y: 22, height: 62, shift: 4.5, rise: -1.2 },
    { y: 94, height: 52, shift: 9, rise: 0.4 },
    { y: 154, height: 66, shift: 14, rise: -0.8 },
  ];
  const baseX = glyph.x - glyph.maskWidth / 2;
  const baseY = BASELINE_Y - glyph.maskBaseline;

  ctx.save();
  ctx.globalAlpha = 0.035 + intensity * 0.11;
  ctx.filter = `blur(${(1.4 + intensity * 3.1).toFixed(2)}px)`;

  bands.forEach((band, index) => {
    const modulation = 1 + 0.16 * Math.sin(seconds * 1.7 + glyph.phase + index * 0.8);
    const dx = intensity * band.shift * modulation;
    const dy = intensity * band.rise * Math.cos(seconds * 1.2 + glyph.phase + index);

    ctx.drawImage(
      glyph.maskCanvas,
      0,
      band.y,
      glyph.maskWidth,
      band.height,
      baseX + dx,
      baseY + band.y + dy,
      glyph.maskWidth,
      band.height
    );
  });

  ctx.restore();
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function easeInOutSine(value) {
  const t = clamp(value, 0, 1);
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
