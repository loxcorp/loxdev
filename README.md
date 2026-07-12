<p align="center">
  <img src="https://cdn.prod.website-files.com/69082c5061a39922df8ed3b6/6a6758afd07eefb010ad528a_ChatGPT%20Image%20Jul%2027%2C%202026%2C%2002_06_09%20PM.png" alt="Lox Dev" width="100%">
</p>

<p align="center">
  <img src="https://cdn.prod.website-files.com/69082c5061a39922df8ed3b6/6a677901022ac1891debdb28_loxdev.png" alt="loxdev" width="88">
</p>

<h1 align="center">Lox Dev</h1>

<p align="center">
  The developer toolkit for <a href="https://loxcorp.com">Lox Corp</a> on Robinhood Chain —
  a live-data CLI, a zero-dependency library, and an MCP server for agents, tokens and DeFi.
</p>

<p align="center">
  <a href="https://loxcorp.com">Website</a> ·
  <a href="https://loxcorp.com/docs">Docs</a> ·
  <a href="https://www.npmjs.com/package/loxcorp">npm</a> ·
  <a href="https://robinhoodchain.blockscout.com">Explorer</a> ·
  <a href="https://ponsfamily.com/launchpad/0x0000000000000000000000000000000000000000">Buy $LOX</a> ·
  <a href="https://x.com/loxcorp">X</a>
</p>

---

## Overview

Lox Corp is the home of agentic finance on Robinhood Chain — self-custody agents
that trade, launch their own tokens, and fund their own compute. **Lox Dev** is
how you build against it from the terminal, from your code, or from any AI agent.

One package, three surfaces:

- **CLI** — read the chain and every Lox launch live, with no configuration.
- **Library** — the same reads, `require`-able from any Node project.
- **MCP server** — expose the chain to Claude, Cursor, Windsurf, or your own agent host over the Model Context Protocol.

Everything is read directly from the public chain. There is no API key, no
account, and no server in the middle.

## Requirements

- Node.js 18 or newer (uses the built-in `fetch`)
- No other dependencies

## Install

Run it without installing:

```bash
npx loxcorp help
```

Or install globally for the `loxcorp` and `lox` commands:

```bash
npm install -g loxcorp
lox stats
```

## Quick start

```bash
lox stats            # live Robinhood Chain stats
lox launches         # every agent launched through Lox Corp
lox network          # the Lox network roll-up
lox lox              # the $LOX token
lox agent 0x…        # inspect one agent and its mandate
lox watch            # live-follow the chain
lox contracts        # chain + contract reference
```

## CLI

| Group | Commands |
| --- | --- |
| Chain | `stats` · `gas` · `price` · `block` · `blocks` · `chart` · `watch` |
| Lox | `launches` · `network` · `lox` · `agent <address>` |
| Market | `tokens [n]` · `token <address>` · `holders <address>` · `search <query>` |
| Lookup | `txs` · `tx <hash>` · `address <address>` · `top` |
| Build | `mcp` · `contracts` · `launch` · `buy` · `site` · `docs` · `version` |

Full reference: [docs/cli.md](docs/cli.md).

## Library

```js
const lox = require("loxcorp");

const summary = await lox.networkSummary();
// { launches, treasuryEth, holders, marketCapUsd, agents }

const agents = await lox.launchesEnriched();
// [{ token, symbol, name, mandate, holders, priceUsd, mcap, liquidityEth, ... }]

const raw = await lox.get("/tokens/" + lox.CONTRACTS.lox);
```

Exports include `CHAIN`, `CONTRACTS`, `LINKS`, `LAUNCH`, the `get` client,
`format` helpers, and the Lox reads (`launches`, `launchesEnriched`,
`networkSummary`, `poolLiquidity`, `loxToken`, `parseMandate`, `cleanDesc`).
See [examples/library.js](examples/library.js).

## MCP server

Give any agent host live, read-only access to Robinhood Chain and Lox data. Add
this to your MCP client config — the same shape works for Claude Desktop, Cursor
and Windsurf:

```json
{
  "mcpServers": {
    "loxcorp": {
      "command": "npx",
      "args": ["-y", "loxcorp", "mcp"]
    }
  }
}
```

Twenty-one tools are exposed, grouped as chain, market and Lox. Highlights:
`get_stats`, `get_tokens`, `get_token`, `search`, `get_lox_launches`,
`get_lox_network`, `get_lox_token`, `get_agent`, `get_launch_guide`. Full setup
and tool list: [docs/mcp.md](docs/mcp.md).

## Network and contracts

| Item | Value |
| --- | --- |
| Chain | Robinhood Chain |
| Chain ID | 4663 |
| RPC | `https://rpc.mainnet.chain.robinhood.com` |
| Explorer | `https://robinhoodchain.blockscout.com` |
| $LOX token | `0x0000000000000000000000000000000000000000` |
| Launch factory | `0x6f222a46241fdDEB97502b2e2f5Ff97454009C20` |
| LP locker | `0xe77bD02772cFE9AC5B4EbEEa8C575B8077Cf32bd` |
| Swap router | `0xcaf681a66d020601342297493863e78c959e5cb2` |
| WETH | `0x0bd7d308f8e1639fab988df18a8011f41eacad73` |
| Pool fee | 1% |

Run `lox contracts` to print this from the CLI.

## How a launch works

A launch is a single transaction. The factory deploys the token, seeds a
Uniswap V3 pool, and locks the LP forever — self-custody, no rug.

```
createAgent(name, symbol, imageUrl, description, salt, devBuyMinOut, feeHandle) payable
  -> emits AgentCreated(token, pool, creator, name, symbol, imageUrl, description)
```

Each agent carries an encoded mandate in its description, for example
`[Mandate: Semis, AI]`. The toolkit decodes it automatically (`lox agent`,
`get_agent`, `parseMandate`). Launch from the guided flow with `lox launch`, or
at [loxcorp.com/launch](https://loxcorp.com/launch).

## Architecture

```
loxdev/
  bin/lox.js            CLI entry point
  src/
    constants.js        chain, contracts, links
    client.js           Blockscout REST client + formatters
    lox.js              Lox reads (launches, mandates, treasury, $LOX)
    render.js           terminal rendering helpers
    cli.js              argument parsing + command dispatch
    commands/           chain · market · lookup · lox · act
    mcp/
      tools.js          MCP tool definitions
      server.js         stdio JSON-RPC server
    index.js            library entry point
  docs/                 cli.md · mcp.md
  examples/             library.js · mcp-config.json
```

## Security

The official Lox Corp website is [loxcorp.com](https://loxcorp.com). The only
official `$LOX` token mint on Robinhood Chain is
`0x0000000000000000000000000000000000000000`. Beware of impersonator sites and
tokens. This toolkit is read-only and never asks for a private key or seed
phrase.

## License

[MIT](LICENSE) © Lox Corp
