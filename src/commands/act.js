"use strict";
const { exec } = require("child_process");
const { CHAIN, CONTRACTS, LINKS, LAUNCH } = require("../constants");
const { ok, kv, line, dim, green, heading } = require("../render");

function open(url) {
  const cmd = process.platform === "win32" ? 'start "" "' + url + '"'
    : process.platform === "darwin" ? 'open "' + url + '"'
    : 'xdg-open "' + url + '"';
  exec(cmd, () => {});
}

function launch() {
  ok("launch an agent on Robinhood Chain");
  line("");
  line("  " + dim("A launch is one transaction. The factory deploys your token,"));
  line("  " + dim("seeds a Uniswap V3 pool, and locks the LP forever."));
  line("");
  kv("01", "connect a wallet on the launcher");
  kv("02", "name it, set an image, add a mandate");
  kv("03", "sign once — then " + green("lox launches") + " to watch it appear");
  line("");
  open(LINKS.launch);
  line("  " + dim("if the browser didn't open: " + LINKS.launch));
}

function contracts() {
  heading("network");
  kv("chain", CHAIN.name);
  kv("chain id", CHAIN.chainId);
  kv("rpc", CHAIN.rpc);
  kv("explorer", CHAIN.explorer);
  heading("contracts");
  kv("$LOX token", CONTRACTS.lox);
  kv("launch factory", CONTRACTS.factory);
  kv("LP locker", CONTRACTS.locker);
  kv("swap router", CONTRACTS.swapRouter);
  kv("WETH", CONTRACTS.weth);
  kv("pool fee", (CONTRACTS.poolFee / 10000) + "%");
  heading("launch call");
  line("  " + dim(LAUNCH.method));
  line("  " + dim(LAUNCH.note));
}

module.exports = { open, launch, contracts, site: () => open(LINKS.site), buy: () => open(LINKS.buyLox), docs: () => open(LINKS.docs) };
