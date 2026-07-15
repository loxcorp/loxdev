# CLI reference

Run any command with `npx loxcorp <command>` (or `lox <command>` after a global
install). No configuration and no API key — every command reads Robinhood Chain
in real time. Add `NO_COLOR=1` to disable ANSI colour.

## Chain

| Command | Description |
| --- | --- |
| `stats` | Total and daily transactions, addresses, blocks, average block time, gas and ETH price |
| `gas` | Current gas prices (slow / average / fast) |
| `price` | ETH price and market cap |
| `block` | The latest block |
| `blocks` | The most recent blocks |
| `chart` | A 30-day transaction sparkline |
| `watch` | Live-follow the chain (updates every 5s) |

## Lox

| Command | Description |
| --- | --- |
| `launches` | Every agent launched through the Lox factory, ranked by treasury |
| `network` | A roll-up across all Lox launches |
| `lox` | The `$LOX` token — price, holders, market cap, links |
| `agent <address>` | Inspect one agent: identity, creator, pool, decoded mandate, treasury |

## Market

| Command | Description |
| --- | --- |
| `tokens [n]` | Top `n` tokens by holders (default 10) |
| `token <address>` | Full token detail |
| `holders <address>` | Top holders of a token |
| `search <query>` | Search tokens, addresses, blocks and transactions |

## Lookup

| Command | Description |
| --- | --- |
| `txs` | The latest transactions |
| `tx <hash>` | Full transaction detail |
| `address <address>` | Balance and metadata for an address |
| `top` | Richest addresses by balance |

## Build

| Command | Description |
| --- | --- |
| `mcp` | Run as an MCP server over stdio (see [mcp.md](mcp.md)) |
| `contracts` | Chain and contract reference |
| `launch` | Open the guided launcher |
| `buy` / `site` / `docs` | Open Lox Corp resources |
| `version` / `help` | Version and command list |

## Examples

```bash
npx loxcorp stats
npx loxcorp launches
npx loxcorp agent 0x…
npx loxcorp token 0x0000000000000000000000000000000000000000
npx loxcorp watch
```
