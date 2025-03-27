import readline from "readline";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";


function isJSONRPCMessage(message) {
  return (
    typeof message === "object" &&
    message !== null &&
    "jsonrpc" in message
  );
}

export async function CreateSSEProxy(SSE_URL) {
  // Validate SSE URL
  let endpoint = null;
  try {
    endpoint = new URL(SSE_URL);
  } catch (error) {
    throw new Error(`Invalid SSE URL: ${SSE_URL}`);
  }

  const transport = new SSEClientTransport(endpoint);

  transport.onmessage = (event) => {
    try {
      if(!isJSONRPCMessage(event)) {
        throw new Error("Invalid JSON-RPC message");
      }
      const data = JSON.stringify(event);
      process.stdout.write(data + "\n");
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };
  await transport.start();

  transport.onerror = (error) => {
    console.error("SSE connection error:", error);
  };

  // 创建 readline 接口监听 stdin 的数据
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  // Listen for stdin input and submit it to the server
  rl.on("line", async (line) => {
    try {
      const message = JSON.parse(line);
      if(!isJSONRPCMessage(message)) {
        throw new Error("Invalid JSON-RPC message");
      }
      await transport.send(message);
    } catch (e) {
      console.error("Error parsing input:", e);
    }
  });
}