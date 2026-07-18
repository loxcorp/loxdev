"use strict";
const { num, eth, usd, shortAddr } = require("../client");
const { CHAIN, CONTRACTS, LINKS } = require("../constants");
const loxlib = require("../lox");
const { ok, kv, line, dim, bold, green } = require("../render");

/** Every agent launched through the Lox factory, ranked by treasury. */
async function launches() {
  const ls = await loxlib.launchesEnriched();
  if (!ls.length) {
    ok("Lox launches");
    line("  " + dim("no agents launched yet — be the first: " + LINKS.launch));
    return;
  }
  ls.sort((a, b) => (b.liquidityEth || 0) - (a.liquidityEth || 0));
  ok(ls.length + " agent" + (ls.length === 1 ? "" : "s") + " launched through Lox Corp");
  ls.forEach((l) => {
    line("  " + bold(("$" + (l.symbol || "?")).padEnd(10))
      + (l.name || "").padEnd(20).slice(0, 20)
      + dim("treasury ") + green((l.liquidityEth || 0).toFixed(3) + " ETH")
      + dim("  holders ") + num(l.holders)
      + (l.mcap ? dim("  mcap ") + usd(l.mcap) : ""));
  });
  line("  " + dim("inspect one: lox agent <address>   ·   " + LINKS.site));
}

/** Network roll-up across every Lox launch. */
async function network() {
  const s = await loxlib.networkSummary();
  ok("Lox network · live");
  kv("agent launches", num(s.launches));
  kv("total treasury", s.treasuryEth.toFixed(3) + " ETH");
  kv("shareholders", num(s.holders));
  kv("combined market cap", usd(s.marketCapUsd));
}

/** $LOX token detail. */
async function lox() {
  ok("$LOX · Lox Corp");
  kv("contract", CONTRACTS.lox);
  try {
    const t = await loxlib.loxToken();
    kv("name", t.name || "Lox");
    kv("holders", t.holders_count ? num(t.holders_count) : "—");
    kv("price", t.exchange_rate ? "$" + Number(t.exchange_rate).toPrecision(4) : "—");
    kv("market cap", t.circulating_market_cap ? usd(Number(t.circulating_market_cap)) : "—");
    kv("total supply", t.total_supply ? num(Number(t.total_supply) / Math.pow(10, Number(t.decimals || 18))) : "—");
  } catch (e) {
    line("  " + dim("token detail unavailable right now"));
  }
  kv("buy", LINKS.buyLox);
  kv("explorer", CHAIN.explorer + "/token/" + CONTRACTS.lox);
}

/** Inspect one agent by its token address: identity, mandate, treasury. */
async function agent(addr) {
  if (!addr) throw new Error("usage: lox agent <token address>");
  const ls = await loxlib.launches();
  const l = ls.find((x) => (x.token || "").toLowerCase() === addr.toLowerCase());
  if (!l) throw new Error("no Lox agent found at " + addr);
  const liq = await loxlib.poolLiquidity(l.pool);
  ok((l.name || "agent") + " ($" + (l.symbol || "?") + ")");
  kv("token", l.token);
  kv("creator", shortAddr(l.creator));
  kv("pool", shortAddr(l.pool));
  kv("mandate", l.mandate.length ? l.mandate.join(", ") : "—");
  const desc = loxlib.cleanDesc(l.description);
  if (desc) kv("about", desc.slice(0, 60));
  kv("treasury", liq.toFixed(4) + " ETH");
  kv("token page", LINKS.site + "/token?a=" + l.token);
}

module.exports = { launches, network, lox, agent };

