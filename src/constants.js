"use strict";
/**
 * Network + protocol constants for Robinhood Chain and the Lox Corp contracts.
 * Everything the toolkit talks to is derived from this file — point these at a
 * different deployment and the CLI, library and MCP server all follow.
 */

const CHAIN = {
  name: "Robinhood Chain",
  chainId: 4663,
  rpc: "https://rpc.mainnet.chain.robinhood.com",
  explorer: "https://robinhoodchain.blockscout.com",
  api: "https://robinhoodchain.blockscout.com/api/v2",
};

const CONTRACTS = {
  // Lox Corp's own launch factory + LP locker.
  factory: "0x6f222a46241fdDEB97502b2e2f5Ff97454009C20",
  locker: "0xe77bD02772cFE9AC5B4EbEEa8C575B8077Cf32bd",
  factoryDeployBlock: 20816911,
  // Uniswap V3 router used for on-chain buys/sells.
  swapRouter: "0xcaf681a66d020601342297493863e78c959e5cb2",
  weth: "0x0bd7d308f8e1639fab988df18a8011f41eacad73",
  poolFee: 10000, // 1%
  // The $LOX token.
  lox: "0x0000000000000000000000000000000000000000",
};

const LINKS = {
  site: "https://loxcorp.com",
  launch: "https://loxcorp.com/launch",
  dashboard: "https://loxcorp.com/dashboard",
  docs: "https://loxcorp.com/docs",
  buyLox: "https://ponsfamily.com/launchpad/" + CONTRACTS.lox,
  npm: "https://www.npmjs.com/package/loxcorp",
  x: "https://x.com/loxcorp",
};

// The on-chain launch call. Deploys the token, seeds a Uniswap V3 pool, and
// locks the LP in a single transaction.
const LAUNCH = {
  method: "createAgent(string name,string symbol,string imageUrl,string description,bytes32 salt,uint256 devBuyMinOut,address feeHandle) payable",
  event: "AgentCreated(address token,address pool,address creator,string name,string symbol,string imageUrl,string description)",
  note: "One transaction: token + pool + locked liquidity. Self-custody, no rug.",
};

module.exports = { CHAIN, CONTRACTS, LINKS, LAUNCH };


