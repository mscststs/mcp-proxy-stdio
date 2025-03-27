import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import fs from "fs/promises";


async function getLogFile(log = ""){
  let logFile = null;
  if (log) {
    try {
      const stats = await fs.stat(log);
      if (stats.isDirectory()) {
        logFile = `${log}/proxy.log`;
      } else {
        logFile = log;
      }
    } catch (error) {
      // If path doesn't exist, create the file
      if (error.code === 'ENOENT') {
        if (log.endsWith('/') || log.endsWith('\\')) {
          await fs.mkdir(log, { recursive: true });
          logFile = `${log}/proxy.log`;
        } else {
          const dir = log.substring(0, log.lastIndexOf('/'));
          if (dir) {
            await fs.mkdir(dir, { recursive: true });
          }
          logFile = log;
        }
        await fs.writeFile(logFile, ''); // Create empty file
      } else {
        throw error;
      }
    }
  }
  return logFile;
}

export async function CreateSSEProxy(SSE_URL, log = "") {
  // Validate SSE URL
  let endpoint = null;
  try {
    endpoint = new URL(SSE_URL);
  } catch (error) {
    throw new Error(`Invalid SSE URL: ${SSE_URL}`);
  }

  let logFile = await getLogFile(log);

  const transport = new SSEClientTransport(endpoint);
  const stdioTransport = new StdioServerTransport();


  transport.onmessage = async (message) => {
    try {
      // Log the message to the file
      if(logFile) {
        await fs.appendFile(logFile, JSON.stringify(message) + '\n');
      }

      await stdioTransport.send(message);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  stdioTransport.onmessage = async (message) => {
    try {
      // Log the message to the file
      if(logFile) {
        await fs.appendFile(logFile, JSON.stringify(message) + '\n');
      }

      await transport.send(message);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  await transport.start();
  await stdioTransport.start();

}