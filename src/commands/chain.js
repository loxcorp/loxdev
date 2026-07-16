"use strict";
const { get, num } = require("../client");
const { ok, kv, line, spark, green, dim } = require("../render");

async function stats() {
  const s = await get("/stats");
  ok("Robinhood Chain · live");
  kv("total transactions", num(s.total_transactions));
  kv("transactions today", num(s.transactions_today));
  kv("total addresses", num(s.total_addresses));
  kv("total blocks", num(s.total_blocks));
  kv("avg block time", (s.average_block_time / 1000).toFixed(1) + "s");
  kv("gas slow/avg/fast", s.gas_prices.slow + " / " + s.gas_prices.average + " / " + s.gas_prices.fast + " gwei");
  if (s.coin_price) kv("ETH price", "$" + num(Number(s.coin_price).toFixed(2)));
}

async function gas() {
  const s = await get("/stats");
  ok("gas · Robinhood Chain");
  kv("slow", s.gas_prices.slow + " gwei");
  kv("average", s.gas_prices.average + " gwei");
  kv("fast", s.gas_prices.fast + " gwei");
}

async function price() {
  const s = await get("/stats");
  ok("market · live");
  kv("ETH price", s.coin_price ? "$" + num(Number(s.coin_price).toFixed(2)) : "—");
  kv("market cap", s.market_cap ? "$" + num(Math.round(Number(s.market_cap))) : "—");
  kv("gas used today", num(s.gas_used_today));
}

async function block() {
  const b = await get("/main-page/blocks");
  const top = b[0];
  ok("latest block");
  kv("height", num(top.height));
  kv("transactions", num(top.transactions_count ?? top.tx_count ?? 0));
  kv("timestamp", top.timestamp);
}

async function blocks() {
  const b = await get("/main-page/blocks");
  ok("latest blocks");
  (b || []).slice(0, 6).forEach((bl) => {
    line("  " + ("#" + num(bl.height)).padEnd(14) + dim("txs ") + String(bl.transactions_count ?? bl.tx_count ?? 0).padEnd(5) + dim(bl.timestamp));
  });
}

async function chart() {
  const c = await get("/stats/charts/transactions");
  const pts = (c.chart_data || []).slice(0, 30).reverse();
  const vals = pts.map((p) => p.transactions_count);
  ok("daily transactions · last " + vals.length + " days");
  line("  " + green(spark(vals)));
  kv("peak", num(Math.max.apply(null, vals)) + "/day");
  kv("latest", num(vals[vals.length - 1]) + "/day (" + pts[pts.length - 1].date + ")");
}

async function watch() {
  ok("watching Robinhood Chain · ctrl-c to stop");
  let last = 0;
  const tick = async () => {
    try {
      const s = await get("/stats");
      const t = Number(s.total_transactions);
      const delta = last ? t - last : 0;
      last = t;
      line("  " + dim(new Date().toLocaleTimeString()) + "  txs " + num(t) + (delta ? green("  +" + num(delta)) : "") + dim("  gas " + s.gas_prices.average + " gwei"));
    } catch (e) {
      line("  " + dim("fetch failed — retrying"));
    }
  };
  await tick();
  setInterval(tick, 5000);
}

module.exports = { stats, gas, price, block, blocks, chart, watch };

