"use strict";
/**
 * Programmatic entry point — import the same live data the CLI and MCP server use.
 *
 *   const lox = require("loxcorp");
 *   const summary = await lox.networkSummary();
 *   const agents = await lox.launchesEnriched();
 */

const constants = require("./constants");
const client = require("./client");
const loxlib = require("./lox");

module.exports = {
  ...constants,               // CHAIN, CONTRACTS, LINKS, LAUNCH
  get: client.get,            // raw explorer GET
  format: {                   // formatting helpers
    num: client.num, eth: client.eth, usd: client.usd,
    compact: client.compact, shortHash: client.shortHash, shortAddr: client.shortAddr,
  },
  // Lox reads
  launches: loxlib.launches,
  launchesEnriched: loxlib.launchesEnriched,
  networkSummary: loxlib.networkSummary,
  poolLiquidity: loxlib.poolLiquidity,
  loxToken: loxlib.loxToken,
  parseMandate: loxlib.parseMandate,
  cleanDesc: loxlib.cleanDesc,
  // MCP
  mcpTools: require("./mcp/tools").TOOLS,
};
