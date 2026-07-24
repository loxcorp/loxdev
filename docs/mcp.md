# MCP server

`loxcorp mcp` runs a [Model Context Protocol](https://modelcontextprotocol.io)
server over stdio (JSON-RPC 2.0). It gives any agent host live, read-only access
to Robinhood Chain and Lox Corp data. Zero dependencies, no API key.

## Add it to a host

Point your MCP client at `npx -y loxcorp mcp`. The same config works for Claude
Desktop, Cursor, Windsurf, and any other MCP host (see
[`examples/mcp-config.json`](../examples/mcp-config.json)):

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

- Claude Desktop: `claude_desktop_config.json`
- Cursor: `.cursor/mcp.json`
- Windsurf: `~/.codeium/windsurf/mcp_config.json`

## Try it from the terminal

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_lox_network"}}' \
  | npx loxcorp mcp
```

## Tools

Chain: `get_stats`, `get_gas`, `get_price`, `get_tx_chart`, `get_latest_block`,
`get_latest_blocks`, `get_latest_transactions`, `get_transaction`,
`get_address`, `get_address_transactions`, `get_top_addresses`.

Market: `get_tokens`, `get_token`, `get_token_holders`, `get_token_transfers`,
`search`.

Lox: `get_lox_launches`, `get_lox_network`, `get_lox_token`, `get_agent`,
`get_launch_guide`.

Each tool returns raw JSON read from the chain. Tools that take an address use a
single `address` (or `hash` / `query`) string argument.


