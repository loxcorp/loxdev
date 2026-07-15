"use strict";
// Programmatic usage — the same live data the CLI and MCP server read.
// Run:  node examples/library.js
const lox = require("../src");

(async () => {
  const summary = await lox.networkSummary();
  console.log("Lox network");
  console.log("  launches ", summary.launches);
  console.log("  treasury ", summary.treasuryEth.toFixed(3), "ETH");
  console.log("  holders  ", summary.holders);
  console.log("  mcap     ", lox.format.usd(summary.marketCapUsd));

  console.log("\nAgents");
  for (const a of summary.agents.slice(0, 5)) {
    console.log("  $" + (a.symbol || "?"), "—", (a.liquidityEth || 0).toFixed(3), "ETH", a.mandate.length ? "· " + a.mandate.join(", ") : "");
  }

  console.log("\nContracts");
  console.log("  $LOX   ", lox.CONTRACTS.lox);
  console.log("  factory", lox.CONTRACTS.factory);
})().catch((e) => { console.error("error:", e.message); process.exit(1); });
