#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { setTimeout } from "node:timers";
import { CreateSSEProxy } from "../index.js";

const argv = await yargs(hideBin(process.argv))
  .scriptName("sse-proxy")
  .command("$0 <sseurl>", "Start SSE Proxy", (yargs) => {
    yargs.positional("sseurl", {
      type: "string",
      describe: "The SSE URL to connect to",
      demandOption: true,
    });
  })
  .help()
  .parseAsync();

const proxy = async () => {
  const { sseurl } = argv;

  try {
    const proxy = await CreateSSEProxy(sseurl);

    return proxy;
  } catch (error) {
    console.error("Failed to start SSE Proxy:", error);
    throw error;
  }
};

const main = async () => {
  process.on("SIGINT", () => {

    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  try {
    await proxy();
  } catch (error) {
    console.error("Could not start the SSE Proxy", error);

    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
};

await main();