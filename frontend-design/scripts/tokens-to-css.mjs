#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { argv, exit, stdout } from 'node:process';

const args = argv.slice(2);
const input = args[0];
const outIndex = args.indexOf('--out');
const output = outIndex >= 0 ? args[outIndex + 1] : null;

if (!input || (outIndex >= 0 && !output)) {
  stdout.write('Usage: node scripts/tokens-to-css.mjs <design-tokens.json> [--out tokens.css]\n');
  exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(input, 'utf8'));
} catch (error) {
  stdout.write(`Error: cannot read tokens from ${input}: ${error.message}\n`);
  exit(1);
}

const kebab = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .toLowerCase();

// 令牌来自本地文件；此处仅阻止会破坏 CSS 声明结构的值。
const safeValue = (value) => {
  const text = String(value);
  return /[\r\n{};]/.test(text) ? null : text;
};

function flatten(node, prefix, lines) {
  for (const [key, value] of Object.entries(node)) {
    if (key === 'dark') continue;
    const parts = [...prefix, kebab(key)];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, parts, lines);
      continue;
    }
    const name = `--${parts.join('-')}`;
    const cssValue = safeValue(value);
    if (cssValue === null) {
      stdout.write(`Warning: skipped unsafe value for ${name}\n`);
      continue;
    }
    lines.push(`  ${name}: ${cssValue};`);
  }
}

const rootLines = [];
flatten(data, [], rootLines);
const blocks = [`:root {\n${rootLines.join('\n')}\n}`];

if (data.dark && typeof data.dark === 'object' && !Array.isArray(data.dark)) {
  const darkLines = [];
  flatten(data.dark, [], darkLines);
  if (darkLines.length) {
    blocks.push(
      `@media (prefers-color-scheme: dark) {\n  :root {\n${darkLines
        .map((line) => `  ${line}`)
        .join('\n')}\n  }\n}`,
    );
  }
}

const css = `${blocks.join('\n\n')}\n`;
if (output) {
  writeFileSync(output, css, 'utf8');
  stdout.write(`Wrote ${output}\n`);
} else {
  stdout.write(css);
}
