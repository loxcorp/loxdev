"use strict";
const { get, num, shortHash } = require("../client");
const { CHAIN } = require("../constants");
const { ok, kv, line, dim, bold } = require("../render");

async function tokens(count) {
  const t = await get("/tokens?type=ERC-20");
  const items = (t.items || []).filter((x) => x.holders_count).slice(0, count || 10);
  ok("top tokens on Robinhood Chain · by holders");
  for (const it of items) {
    line("  " + bold((it.symbol || "?").padEnd(10)) + (it.name || "").padEnd(28).slice(0, 28)
      + dim("holders ") + num(it.holders_count)
      + (it.circulating_market_cap ? dim("  mcap $") + num(Number(it.circulating_market_cap).toFixed(0)) : ""));
  }
  line("  " + dim("explorer: " + CHAIN.explorer + "/tokens"));
}

async function token(addr) {
  if (!addr) throw new Error("usage: lox token <address>");
  const t = await get("/tokens/" + addr);
  ok((t.name || "token") + " ($" + (t.symbol || "?") + ")");
  kv("address", t.address_hash || addr);
  kv("holders", t.holders_count ? num(t.holders_count) : "—");
  kv("price", t.exchange_rate ? "$" + Number(t.exchange_rate).toPrecision(4) : "—");
  kv("decimals", t.decimals || "—");
  kv("total supply", t.total_supply ? num(Number(t.total_supply) / Math.pow(10, Number(t.decimals || 18))) : "—");
  kv("market cap", t.circulating_market_cap ? "$" + num(Number(t.circulating_market_cap).toFixed(0)) : "—");
  kv("explorer", CHAIN.explorer + "/token/" + addr);
}

async function search(q) {
  if (!q) throw new Error("usage: lox search <query>");
  const r = await get("/search?q=" + encodeURIComponent(q));
  const items = (r.items || []).slice(0, 8);
  ok('search "' + q + '" · ' + items.length + " results");
  for (const it of items) {
    line("  " + bold((it.type || "?").padEnd(12)) + (it.name || it.symbol || "").slice(0, 24).padEnd(26) + dim(shortHash(it.address_hash || it.tx_hash || it.block_hash || "")));
  }
}

async function holders(addr) {
  if (!addr) throw new Error("usage: lox holders <token address>");
  const r = await get("/tokens/" + addr + "/holders");
  ok("top holders");
  (r.items || []).slice(0, 10).forEach((h, i) => {
    const a = (h.address && h.address.hash) || h.address_hash || "?";
    line("  " + dim(("#" + (i + 1)).padEnd(4)) + shortHash(a) + dim("  ") + num(h.value));
  });
}

module.exports = { tokens, token, search, holders };


