import fs from "fs";
import config from "lib/config";
import type { HistoryEntry } from "definitions";

class DebugLogger {
  private logFilePath: string;
  private messageHistoryFilePath: string;

  constructor() {
    this.logFilePath = config.LOG_FILE_PATH_DEFAULT;
    this.messageHistoryFilePath = config.MESSAGE_HISTORY_FILE_PATH_DEFAULT;
    if (config.DEBUG_MODE) {
      console.log("Debug mode enabled. Logging to debug.log");
      console.log("Clearing old logs...");
      this.clear();
    }
  }

  history(messageHistory: HistoryEntry[]) {
    fs.writeFileSync(
      this.messageHistoryFilePath,
      JSON.stringify(messageHistory, null, 2)
    );
  }

  debug(message: string | object) {
    if (!config.DEBUG_MODE) {
      return;
    }

    let msg = JSON.stringify(message, null, 2);
    fs.appendFileSync(this.logFilePath, msg + "\n-----\n");
  }

  private clear() {
    fs.writeFileSync(this.logFilePath, "");
  }
}

export default new DebugLogger();
