"use strict";
/**
 * Lox-specific reads: agents launched through the Lox factory, their pools,
 * treasuries, and the encoded mandate that ships in each launch description.
 */

const { CONTRACTS } = require("./constants");
const { get } = require("./client");

/** Parse the `[Mandate: Semis, AI]` tag Lox agents carry in their description. */
function parseMandate(desc) {
  if (!desc) return [];
  const m = /\[mandate:\s*([^\]]+)\]/i.exec(desc);
  return m ? m[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
}

/** The human-readable description with the mandate tag stripped out. */
function cleanDesc(desc) {
  return desc ? desc.replace(/\s*\[mandate:[^\]]*\]/i, "").trim() : "";
}

/** Every agent launched through the Lox factory (decoded AgentCreated logs). */
async function launches() {
  const r = await get("/addresses/" + CONTRACTS.factory + "/logs");
  const items = (r.items || []).filter(
    (l) => l.decoded && /^AgentCreated\(/.test(l.decoded.method_call || "")
  );
  return items.map((l) => {
    const p = {};
    (l.decoded.parameters || []).forEach((x) => { p[x.name] = x.value; });
    return {
      token: p.token,
      pool: p.pool,
      creator: p.creator,
      name: p.name,
      symbol: p.symbol,
      imageUrl: p.imageUrl,
      description: p.description,
      mandate: parseMandate(p.description),
      tx: l.transaction_hash || l.tx_hash,
      block: Number(l.block_number || 0),
      at: l.block_timestamp || null,
    };
  });
}

/** WETH liquidity (treasury, in ETH) held by a pool. */
async function poolLiquidity(pool) {
  if (!pool) return 0;
  try {
    const r = await get("/addresses/" + pool + "/token-balances");
    const arr = Array.isArray(r) ? r : (r.items || []);
    for (const t of arr) {
      const tk = t.token || {};
      if ((tk.symbol || "").toUpperCase() === "WETH") {
        return Number(t.value) / Math.pow(10, Number(tk.decimals || 18));
      }
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

/** Launches joined with live token detail + pool treasury. */
async function launchesEnriched() {
  const ls = await launches();
  return Promise.all(
    ls.map(async (l) => {
      const [tok, liq] = await Promise.all([
        get("/tokens/" + l.token).catch(() => null),
        poolLiquidity(l.pool),
      ]);
      const supply = tok && tok.total_supply
        ? Number(tok.total_supply) / Math.pow(10, Number(tok.decimals || 18))
        : 0;
      return Object.assign({}, l, {
        holders: tok ? Number(tok.holders_count || 0) : 0,
        priceUsd: tok && tok.exchange_rate ? Number(tok.exchange_rate) : 0,
        mcap: tok && tok.circulating_market_cap ? Number(tok.circulating_market_cap) : (tok && tok.exchange_rate ? supply * Number(tok.exchange_rate) : 0),
        supply,
        liquidityEth: liq,
      });
    })
  );
}

/** Network-wide roll-up across every Lox launch. */
async function networkSummary() {
  const ls = await launchesEnriched();
  return {
    launches: ls.length,
    treasuryEth: ls.reduce((s, l) => s + (l.liquidityEth || 0), 0),
    holders: ls.reduce((s, l) => s + Number(l.holders || 0), 0),
    marketCapUsd: ls.reduce((s, l) => s + Number(l.mcap || 0), 0),
    agents: ls,
  };
}

/** The $LOX token detail. */
async function loxToken() {
  return get("/tokens/" + CONTRACTS.lox);
}

module.exports = {
  parseMandate,
  cleanDesc,
  launches,
  poolLiquidity,
  launchesEnriched,
  networkSummary,
  loxToken,
};


