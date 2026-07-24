"use strict";
/**
 * A tiny, dependency-free client for the Robinhood Chain Blockscout REST API,
 * plus formatting helpers shared across the CLI, library and MCP server.
 * Requires Node 18+ (global fetch).
 */

const { CHAIN } = require("./constants");

/** Low-level GET against the explorer API. Returns parsed JSON or throws. */
async function get(path, opts = {}) {
  const url = CHAIN.api + path;
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), opts.timeout || 15000);
  try {
    const res = await fetch(url, { headers: { accept: "application/json" }, signal: ctrl.signal });
    if (!res.ok) throw new Error("HTTP " + res.status + " for " + path);
    return await res.json();
  } catch (e) {
    if (e.name === "AbortError") throw new Error("request timed out: " + path);
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

/* ------------------------------- formatting ------------------------------- */

const num = (x) => Number(x || 0).toLocaleString("en-US");

/** Format a wei string as ETH (adaptive precision). */
function eth(wei) {
  const v = Number(wei || 0) / 1e18;
  if (v >= 1000) return num(Math.round(v));
  return v.toFixed(v >= 1 ? 4 : 6);
}

/** Compact USD ($1.2K, $3.4M). */
function usd(v) {
  v = Number(v || 0);
  if (!isFinite(v) || v === 0) return "$0";
  if (v >= 1e9) return "$" + (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3) return "$" + (v / 1e3).toFixed(1) + "K";
  return "$" + v.toFixed(2);
}

/** Compact count (1.2K, 3.4M). */
function compact(v) {
  v = Number(v || 0);
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(1) + "K";
  return String(v);
}

const shortHash = (h) => (h ? h.slice(0, 10) + "…" + h.slice(-6) : "—");
const shortAddr = (a) => (a ? a.slice(0, 6) + "…" + a.slice(-4) : "—");

module.exports = { get, num, eth, usd, compact, shortHash, shortAddr };




