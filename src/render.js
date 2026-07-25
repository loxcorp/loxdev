"use strict";
/** Terminal rendering helpers — ANSI colour, key/value rows, sparklines. */

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code) => (s) => (useColor ? "\x1b[" + code + "m" + s + "\x1b[0m" : String(s));
const green = c("32");
const dim = c("2");
const bold = c("1");
const red = c("31");

const line = (s = "") => console.log(s);
const ok = (s) => line(green("  ✓ ") + s);
const err = (s) => line(red("  × ") + s);
const kv = (k, v) => line("  " + dim(String(k).padEnd(22)) + bold(String(v)));

function banner() {
  line("");
  line("  " + green(bold("LOX")) + bold("DEV") + dim("  ·  developer toolkit for Robinhood Chain"));
  line("  " + dim("https://loxcorp.com"));
  line("");
}

function heading(s) {
  line("  " + bold(s.toUpperCase()));
}

/** Unicode sparkline from an array of numbers. */
function spark(values) {
  const bars = "▁▂▃▄▅▆▇█";
  const max = Math.max.apply(null, values);
  const min = Math.min.apply(null, values);
  const rng = Math.max(1, max - min);
  return values.map((v) => bars[Math.min(7, Math.floor(((v - min) / rng) * 7.99))]).join("");
}

/** Simple left-aligned table with a dim header row. */
function table(rows, widths) {
  rows.forEach((r, i) => {
    const cells = r.map((cell, j) => String(cell).padEnd(widths[j] || 0).slice(0, (widths[j] || 40)));
    const text = "  " + cells.join(dim(" · "));
    line(i === 0 ? dim(text) : text);
  });
}

module.exports = { line, ok, err, kv, banner, heading, spark, table, green, dim, bold, red };




