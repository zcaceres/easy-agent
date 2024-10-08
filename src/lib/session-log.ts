import * as fs from "fs";
import type { HistoryEntry, LogMode } from "src/definitions";
import globals from "src/lib/global-config";

export default class SessionLog {
  filePath;
  private logMode: LogMode;

  private constructor(
    sessionLogDir: string = globals.SESSION_HISTORY_LOG_DIR_PATH_DEFAULT,
    logMode: LogMode = globals.LOG_MODE,
  ) {
    this.filePath = this.createFilePath(sessionLogDir);
    this.logMode = logMode;
  }

  private createFilePath(sessionLogDir: string) {
    let todayDateHumanReadable =
      new Date().toLocaleDateString().replace(/\//g, "-") +
      "--" +
      new Date().toLocaleTimeString();

    const filePath = `${sessionLogDir}/session-log-${todayDateHumanReadable}.md`;

    if (this.logMode !== "test") {
      if (!fs.existsSync(sessionLogDir)) {
        fs.mkdirSync(sessionLogDir, { recursive: true });
      }

      fs.writeFileSync(
        filePath,
        `# Agent Session on ${todayDateHumanReadable}\n\n`,
      );
    }

    return filePath;
  }

  append(entry: HistoryEntry) {
    if (this.logMode === "test") {
      return;
    }

    let markdown = "";
    if (entry.role === "user") {
      entry.content.forEach((item) => {
        if (item.type === "text") {
          markdown += `*User:*\n${item.text}\n\n`;
        }
        if (item.type === "tool_result") {
          markdown += `**Tool Used: ${item.tool_use_id}**\n\n**Result: ${item.content}**\n\n`;
        }
      });
    } else {
      entry.content.forEach((item) => {
        if (item.type === "text") {
          markdown += `*Claude:*\n${item.text}\n\n`;
        }
        if (item.type === "tool_use") {
          markdown += `**Claude asked for tool ${
            item.name
          } with input ${JSON.stringify(item.input)}**\n\n`;
        }
      });
    }
    fs.appendFileSync(this.filePath, markdown);
  }

  static create(sessionLogDir?: string, logMode?: LogMode) {
    return new SessionLog(sessionLogDir, logMode);
  }
}
