import readline from "readline";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// 配置服务器URL
const SSE_URL = "http://localhost:57441/sse";



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
      const data = JSON.stringify(event);

      // If the event is a regular message, output directly
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
  rl.on("line", (line) => {
    try {
      transport.send(JSON.parse(line));
    } catch (e) {
      console.error("Error parsing input:", e);
    }
  });
}