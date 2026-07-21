"use strict";
const chain = require("./commands/chain");
const market = require("./commands/market");
const lookup = require("./commands/lookup");
const loxc = require("./commands/loxcmd");
const act = require("./commands/act");
const { banner, kv, line, heading, green, dim } = require("./render");
const { version } = require("../package.json");

function help() {
  banner();
  heading("chain");
  kv("stats", "live chain stats");
  kv("gas", "current gas prices");
  kv("price", "ETH price + market cap");
  kv("block / blocks", "latest block(s)");
  kv("chart", "30-day transaction sparkline");
  kv("watch", "live-follow the chain");
  heading("lox");
  kv("launches", "agents launched through Lox Corp");
  kv("network", "Lox network roll-up");
  kv("lox", "the $LOX token");
  kv("agent <addr>", "inspect one agent + its mandate");
  heading("market");
  kv("tokens [n]", "top tokens by holders");
  kv("token <addr>", "token details");
  kv("holders <addr>", "top holders of a token");
  kv("search <q>", "search tokens, addresses, txs");
  heading("lookup");
  kv("txs", "latest transactions");
  kv("tx <hash>", "transaction details");
  kv("address <addr>", "balance + info");
  kv("top", "top addresses by balance");
  heading("build");
  kv("mcp", "run as an MCP server (Robinhood Chain + Lox tools)");
  kv("contracts", "chain + contract reference");
  kv("launch", "open the guided launcher");
  kv("buy / site / docs", "open loxcorp resources");
  kv("version / help", "you are here");
  line("");
  line("  " + dim("docs: ") + green("https://loxcorp.com/docs") + dim("   ·   npm: ") + green("npx loxcorp <command>"));
  line("");
}

const ROUTES = {
  stats: () => chain.stats(),
  gas: () => chain.gas(),
  price: () => chain.price(),
  block: () => chain.block(),
  blocks: () => chain.blocks(),
  chart: () => chain.chart(),
  watch: () => chain.watch(),
  launches: () => loxc.launches(),
  network: () => loxc.network(),
  lox: () => loxc.lox(),
  agent: (a) => loxc.agent(a[0]),
  tokens: (a) => market.tokens(parseInt(a[0]) || 10),
  token: (a) => market.token(a[0]),
  holders: (a) => market.holders(a[0]),
  search: (a) => market.search(a.join(" ")),
  txs: () => lookup.txs(),
  tx: (a) => lookup.tx(a[0]),
  address: (a) => lookup.address(a[0]),
  top: () => lookup.top(),
  contracts: () => act.contracts(),
  launch: () => act.launch(),
  buy: () => act.buy(),
  site: () => act.site(),
  docs: () => act.docs(),
  version: () => line(version),
};

async function run(argv) {
  const [cmd, ...args] = argv;
  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") return help();
  if (cmd === "--version" || cmd === "-v") return line(version);
  if (cmd === "mcp") return require("./mcp/server").start();
  const route = ROUTES[cmd];
  if (!route) { line("unknown command: " + cmd); help(); process.exitCode = 1; return; }
  try {
    await route(args);
  } catch (e) {
    line("  error: " + e.message + dim("  (a network connection is required)"));
    process.exitCode = 1;
  }
}

module.exports = { run, help };


