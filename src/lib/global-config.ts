import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import type { CLIArgs } from "definitions";
const argv = yargs(hideBin(process.argv)).argv as CLIArgs;

const globals = {
  DEBUG_MODE: argv.debugMode ?? false,
  MAX_MODEL_TOKENS_DEFAULT: argv.maxModelTokens ?? 2096,
  ANTHROPIC_MODEL_DEFAULT: argv.model ?? "claude-3-haiku-20240307",
  LOG_FILE_PATH_DEFAULT: "logs/debug.log",
  MESSAGE_HISTORY_FILE_PATH_DEFAULT: "logs/message-history.json",
  SESSION_LOG_DIR_PATH_DEFAULT: "session-log",
  ANTHROPIC_API_KEY: argv.apiKey ?? process.env["ANTHROPIC_API_KEY"],
  ANTHROPIC_MAX_PROMPT_CACHE_SIZE: 4,
};

if (globals.DEBUG_MODE) {
  console.log("Config:");
  console.log(globals);
}

export default globals;
