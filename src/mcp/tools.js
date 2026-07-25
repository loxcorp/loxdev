"use strict";
/**
 * MCP tool definitions. Each tool is a name, description, JSON-Schema input,
 * and an async `run` returning JSON. The server (server.js) exposes these over
 * the Model Context Protocol so any agent host can read Robinhood Chain and
 * Lox Corp data live.
 */

const { get } = require("../client");
const { CONTRACTS, CHAIN, LAUNCH, LINKS } = require("../constants");
const lox = require("../lox");

const obj = (properties = {}, required = []) => ({ type: "object", properties, required });
const str = (description) => ({ type: "string", description });

const TOOLS = [
  // ---- chain ----
  { name: "get_stats", description: "Live Robinhood Chain stats: total/daily transactions, addresses, blocks, average block time, gas prices and ETH price.", inputSchema: obj(), run: () => get("/stats") },
  { name: "get_gas", description: "Current gas prices (slow / average / fast) in gwei.", inputSchema: obj(), run: async () => (await get("/stats")).gas_prices },
  { name: "get_price", description: "ETH price and total market cap on Robinhood Chain.", inputSchema: obj(), run: async () => { const s = await get("/stats"); return { coin_price: s.coin_price, market_cap: s.market_cap }; } },
  { name: "get_tx_chart", description: "Daily transaction counts for roughly the last 30 days.", inputSchema: obj(), run: () => get("/stats/charts/transactions") },
  { name: "get_latest_block", description: "The most recent block on Robinhood Chain.", inputSchema: obj(), run: async () => (await get("/main-page/blocks"))[0] },
  { name: "get_latest_blocks", description: "The most recent blocks.", inputSchema: obj(), run: () => get("/main-page/blocks") },
  { name: "get_latest_transactions", description: "The most recent transactions on the chain.", inputSchema: obj(), run: () => get("/main-page/transactions") },
  { name: "get_transaction", description: "Full detail for one transaction by hash.", inputSchema: obj({ hash: str("Transaction hash (0x…)") }, ["hash"]), run: (a) => get("/transactions/" + a.hash) },
  { name: "get_address", description: "Native balance and metadata for an address.", inputSchema: obj({ address: str("Address (0x…)") }, ["address"]), run: (a) => get("/addresses/" + a.address) },
  { name: "get_address_transactions", description: "Transactions for a given address.", inputSchema: obj({ address: str("Address (0x…)") }, ["address"]), run: (a) => get("/addresses/" + a.address + "/transactions") },
  { name: "get_top_addresses", description: "The richest addresses by native balance.", inputSchema: obj(), run: () => get("/addresses") },

  // ---- market ----
  { name: "get_tokens", description: "ERC-20 tokens on Robinhood Chain with name, symbol, holder count and market cap.", inputSchema: obj(), run: () => get("/tokens?type=ERC-20") },
  { name: "get_token", description: "Full detail for one token by contract address.", inputSchema: obj({ address: str("Token contract address (0x…)") }, ["address"]), run: (a) => get("/tokens/" + a.address) },
  { name: "get_token_holders", description: "Top holders of a token.", inputSchema: obj({ address: str("Token contract address") }, ["address"]), run: (a) => get("/tokens/" + a.address + "/holders") },
  { name: "get_token_transfers", description: "Recent transfers of a token.", inputSchema: obj({ address: str("Token contract address") }, ["address"]), run: (a) => get("/tokens/" + a.address + "/transfers") },
  { name: "search", description: "Search across tokens, addresses, blocks and transactions.", inputSchema: obj({ query: str("Search query") }, ["query"]), run: (a) => get("/search?q=" + encodeURIComponent(a.query)) },

  // ---- lox ----
  { name: "get_lox_launches", description: "Every agent launched through the Lox Corp factory, enriched with live price, holders, market cap and pool treasury.", inputSchema: obj(), run: () => lox.launchesEnriched() },
  { name: "get_lox_network", description: "A roll-up across all Lox launches: number of agents, total treasury (ETH), shareholders and combined market cap.", inputSchema: obj(), run: () => lox.networkSummary() },
  { name: "get_lox_token", description: "Detail for the $LOX token (address " + CONTRACTS.lox + ").", inputSchema: obj(), run: () => lox.loxToken() },
  { name: "get_agent", description: "Inspect one Lox agent by its token address — identity, creator, pool, decoded mandate and treasury.", inputSchema: obj({ address: str("Agent token address (0x…)") }, ["address"]), run: async (a) => { const ls = await lox.launches(); const l = ls.find((x) => (x.token || "").toLowerCase() === a.address.toLowerCase()); if (!l) throw new Error("no Lox agent at " + a.address); return Object.assign({}, l, { treasuryEth: await lox.poolLiquidity(l.pool) }); } },
  { name: "get_launch_guide", description: "How to launch an agent token on Robinhood Chain: chain, factory, one-transaction flow, and the loxcorp.com launcher.", inputSchema: obj(), run: async () => ({ chain: CHAIN.name, chain_id: CHAIN.chainId, rpc: CHAIN.rpc, factory: CONTRACTS.factory, method: LAUNCH.method, event: LAUNCH.event, note: LAUNCH.note, launcher: LINKS.launch, cli: "npx loxcorp launch" }) },
];

module.exports = { TOOLS };




