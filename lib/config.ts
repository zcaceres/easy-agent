import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import type { CLIArgs } from "../definitions";
const argv = yargs(hideBin(process.argv)).argv as CLIArgs;

const config = {
  DEBUG_MODE: argv.debugMode ?? true,
  MAX_MODEL_TOKENS_DEFAULT: argv.maxModelTokens ?? 2096,
  ANTHROPIC_MODEL_DEFAULT: argv.model ?? "claude-3-haiku-20240307",
  LOG_FILE_PATH_DEFAULT: "logs/debug.log",
  MESSAGE_HISTORY_FILE_PATH_DEFAULT: "logs/message-history.json",
  SESSION_HISTORY_DIR_PATH_DEFAULT: "session-history",
  ANTHROPIC_API_KEY: argv.apiKey ?? process.env["ANTHROPIC_API_KEY"],
};

if (config.DEBUG_MODE) {
  console.log("Config:");
  console.log(config);
}

export default config;
