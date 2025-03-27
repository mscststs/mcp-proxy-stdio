# mcp-proxy-stdio

A Node.js command-line tool that creates a proxy for Server-Sent Events (SSE) connections through standard I/O.

## Installation

No installation needed. You can run it directly using `npx`:

```bash
npx mcp-proxy-stdio
```

## Examples

Start proxy and connect to an event source:

```bash

# Terminal - Connect to events
npx mcp-proxy-stdio  http://localhost:3000/sse
```

Use In McpConfig

```json
{
  "my-proxy": {
    "command": "npx",
    "args": ["mcp-proxy-stdio", "http://localhost:3000/sse"],
    "disabled": false,
    "autoApprove": []
  }
}
```
