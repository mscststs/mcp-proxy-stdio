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

## debug

# Log File Option

Use `--log ./temp.txt` to specify a log file for debug purposes. This allows you to:

- Save program output to a file instead of console
- Review execution details later for debugging
- Set custom log file path and name
- Capture log messages during program execution

Example:

```bash
npx mcp-proxy-stdio http://localhost:3000/sse --log ./debug.log
```
