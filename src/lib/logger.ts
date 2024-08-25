import fs from "fs";
import globals from "src/lib/global-config";
import type { HistoryEntry, LogLevel } from "src/definitions";

class Logger {
  private logFilePath: string;
  private logLevel: LogLevel;
  private messageHistoryFilePath: string;

  private constructor(logLevel: LogLevel) {
    this.logFilePath = globals.LOG_FILE_PATH_DEFAULT;
    this.messageHistoryFilePath = globals.MESSAGE_HISTORY_FILE_PATH_DEFAULT;
    this.logLevel = logLevel;
    if (this.logLevel === "verbose") {
      console.log("Verbose logs enabled. Logging to debug.log");
      console.log("Clearing old logs...");
      this.clear();
    }
  }

  private get isVerbose() {
    return this.logLevel === "verbose";
  }

  history(messageHistory: HistoryEntry[]) {
    fs.writeFileSync(
      this.messageHistoryFilePath,
      JSON.stringify(messageHistory, null, 2)
    );
  }

  debug(message: string | object) {
    if (!this.isVerbose) {
      return;
    }

    let msg = JSON.stringify(message, null, 2);
    fs.appendFileSync(this.logFilePath, msg + "\n-----\n");
  }

  private clear() {
    fs.writeFileSync(this.logFilePath, "");
  }

  static create(logLevel: LogLevel) {
    return new Logger(logLevel);
  }
}

export default Logger.create(globals.DEBUG_MODE ? "verbose" : "laconic");
