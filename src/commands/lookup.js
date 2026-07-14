"use strict";
const { get, num, eth, shortHash } = require("../client");
const { CHAIN } = require("../constants");
const { ok, kv, line, dim, green } = require("../render");

async function txs() {
  const list = await get("/main-page/transactions");
  ok("latest transactions");
  (list || []).slice(0, 6).forEach((t) => {
    const v = t.value ? Number(t.value) / 1e18 : 0;
    line("  " + dim(shortHash(t.hash)) + "  " + (v ? v.toFixed(5) + " ETH" : dim("contract call")) + "  " + (t.result === "success" ? green("ok") : t.result));
  });
}

async function tx(hash) {
  if (!hash) throw new Error("usage: lox tx <hash>");
  const t = await get("/transactions/" + hash);
  ok("transaction");
  kv("hash", shortHash(t.hash));
  kv("status", t.result || t.status || "—");
  kv("block", t.block_number ? num(t.block_number) : "—");
  kv("from", t.from && t.from.hash ? shortHash(t.from.hash) : "—");
  kv("to", t.to && t.to.hash ? shortHash(t.to.hash) : "—");
  kv("value", t.value ? eth(t.value) + " ETH" : "0");
  kv("fee", t.fee && t.fee.value ? eth(t.fee.value) + " ETH" : "—");
  kv("explorer", CHAIN.explorer + "/tx/" + hash);
}

async function address(addr) {
  if (!addr) throw new Error("usage: lox address <address>");
  const a = await get("/addresses/" + addr);
  ok("address");
  kv("address", a.hash || addr);
  kv("balance", a.coin_balance ? eth(a.coin_balance) + " ETH" : "0");
  kv("is contract", a.is_contract ? "yes" : "no");
  if (a.ens_domain_name) kv("ens", a.ens_domain_name);
  kv("explorer", CHAIN.explorer + "/address/" + addr);
}

async function top() {
  const a = await get("/addresses");
  ok("top addresses by balance");
  (a.items || []).slice(0, 10).forEach((r, i) => {
    line("  " + dim(("#" + (i + 1)).padEnd(4)) + shortHash(r.hash) + dim("  ") + eth(r.coin_balance) + " ETH" + dim("  txs " + num(r.transactions_count)));
  });
}

module.exports = { txs, tx, address, top };
