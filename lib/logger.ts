import fs from "fs";
import globals from "lib/global-config";
import type { HistoryEntry } from "definitions";

class DebugLogger {
  private logFilePath: string;
  private messageHistoryFilePath: string;

  private constructor() {
    this.logFilePath = globals.LOG_FILE_PATH_DEFAULT;
    this.messageHistoryFilePath = globals.MESSAGE_HISTORY_FILE_PATH_DEFAULT;
    if (globals.DEBUG_MODE) {
      console.log("Debug mode enabled. Logging to debug.log");
      console.log("Clearing old logs...");
      this.clear();
    }
  }

  history(messageHistory: HistoryEntry[]) {
    fs.writeFileSync(
      this.messageHistoryFilePath,
      JSON.stringify(messageHistory, null, 2),
    );
  }

  debug(message: string | object) {
    if (!globals.DEBUG_MODE) {
      return;
    }

    let msg = JSON.stringify(message, null, 2);
    fs.appendFileSync(this.logFilePath, msg + "\n-----\n");
  }

  private clear() {
    fs.writeFileSync(this.logFilePath, "");
  }

  static create() {
    return new DebugLogger();
  }
}

export default DebugLogger.create();
