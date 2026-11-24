#!/usr/bin/env node
import { argv, exit, stdout } from 'node:process';

function parseHex(input) {
  const raw = String(input).trim().replace(/^#/, '');
  const hex = raw.length === 3 ? [...raw].map((c) => c + c).join('') : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function luminance([r, g, b]) {
  const linear = (v) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

const [fgArg, bgArg] = argv.slice(2);
if (!fgArg || !bgArg) {
  stdout.write('Usage: node scripts/contrast.mjs <foreground-hex> <background-hex>\n');
  exit(1);
}

const fg = parseHex(fgArg);
const bg = parseHex(bgArg);
if (!fg || !bg) {
  stdout.write('Error: both colors must be #RGB or #RRGGBB hex values.\n');
  exit(1);
}

const l1 = luminance(fg);
const l2 = luminance(bg);
const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
const verdict = (min) => (ratio >= min ? 'PASS' : 'FAIL');

stdout.write(
  JSON.stringify(
    {
      foreground: fgArg,
      background: bgArg,
      contrastRatio: Number(ratio.toFixed(2)),
      wcag: {
        aaNormalText: verdict(4.5),
        aaLargeText: verdict(3),
        aaUiComponents: verdict(3),
        aaaNormalText: verdict(7),
        aaaLargeText: verdict(4.5),
      },
    },
    null,
    2,
  ) + '\n',
);
