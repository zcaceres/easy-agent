import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import type { CLIArgs, Globals, LogMode } from "src/definitions";
const argv = yargs(hideBin(process.argv)).argv as CLIArgs;

function getMode(): LogMode {
  if (argv.debug) {
    return "debug";
  }
  if (argv.testMode) {
    return "test";
  }
  return "none";
}

const globals: Globals = {
  LOG_MODE: getMode(),
  MAX_MODEL_TOKENS_DEFAULT: argv.maxModelTokens ?? 2096,
  ANTHROPIC_MODEL_DEFAULT: argv.model ?? "claude-3-haiku-20240307",
  MESSAGE_HISTORY_LOG_FILE_PATH_DEFAULT: "logs/message-history.json",
  SESSION_HISTORY_LOG_DIR_PATH_DEFAULT: "session-log",
  ANTHROPIC_API_KEY: argv.apiKey ?? process.env["ANTHROPIC_API_KEY"],
  ANTHROPIC_MAX_PROMPT_CACHE_SIZE: 4,
  VOICE_MODE: argv.voice ?? false,
};

if (globals.LOG_MODE === "debug") {
  console.log("Config:");
  // console.log(globals);
}

export default globals;
