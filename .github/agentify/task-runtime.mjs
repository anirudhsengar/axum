#!/usr/bin/env node
// agentify:managed
import { runAgentifyRuntime } from "./runtime-loader.mjs";

process.exitCode = runAgentifyRuntime("task-runtime.mjs", process.argv.slice(2));
