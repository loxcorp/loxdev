"use strict";
/**
 * Model Context Protocol server over stdio (JSON-RPC 2.0), zero dependencies.
 *
 *   npx loxcorp mcp
 *
 * stdout is reserved for protocol messages; logs go to stderr. Point any MCP
 * host (Claude Desktop, Cursor, Windsurf, your own client) at the command
 * above — see examples/mcp-config.json.
 */

const { TOOLS } = require("./tools");
const { version } = require("../../package.json");

const PROTOCOL = "2024-11-05";

function send(msg) { process.stdout.write(JSON.stringify(msg) + "\n"); }
function result(id, r) { send({ jsonrpc: "2.0", id, result: r }); }
function error(id, code, message) { send({ jsonrpc: "2.0", id, error: { code, message } }); }

async function handle(msg) {
  const { id, method, params } = msg;

  if (method === "initialize") {
    return result(id, {
      protocolVersion: (params && params.protocolVersion) || PROTOCOL,
      capabilities: { tools: {} },
      serverInfo: { name: "loxcorp", version },
      instructions: "Live Robinhood Chain and Lox Corp data. Every result is read from the public chain in real time — no keys, no cache.",
    });
  }
  if (method === "notifications/initialized" || method === "initialized") return; // notification
  if (method === "ping") return result(id, {});
  if (method === "tools/list") {
    return result(id, { tools: TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })) });
  }
  if (method === "tools/call") {
    const tool = TOOLS.find((t) => t.name === (params && params.name));
    if (!tool) return error(id, -32602, "unknown tool: " + (params && params.name));
    try {
      const out = await tool.run((params && params.arguments) || {});
      return result(id, { content: [{ type: "text", text: JSON.stringify(out, null, 2) }] });
    } catch (e) {
      return result(id, { content: [{ type: "text", text: "error: " + e.message }], isError: true });
    }
  }
  if (id !== undefined) return error(id, -32601, "method not found: " + method);
}

function start() {
  process.stderr.write("loxcorp MCP server — " + TOOLS.length + " tools on stdio. Ready.\n");
  let buf = "", inFlight = 0, ended = false;
  const maybeExit = () => { if (ended && inFlight === 0) process.exit(0); };
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    buf += chunk;
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const raw = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!raw) continue;
      let msg; try { msg = JSON.parse(raw); } catch (e) { continue; }
      inFlight++;
      Promise.resolve(handle(msg))
        .catch((e) => { if (msg && msg.id !== undefined) error(msg.id, -32603, e.message); })
        .finally(() => { inFlight--; maybeExit(); });
    }
  });
  process.stdin.on("end", () => { ended = true; maybeExit(); });
}

module.exports = { start };


