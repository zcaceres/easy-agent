import * as fs from "fs";
import type { HistoryEntry } from "definitions";
import globals from "lib/global-config";

export default class SessionLog {
  filePath;

  constructor() {
    this.filePath = this.createFilePath();
  }

  private createFilePath() {
    let todayDateHumanReadable =
      new Date().toLocaleDateString().replace(/\//g, "-") +
      "--" +
      new Date().toLocaleTimeString();

    const filePath = `${globals.SESSION_LOG_DIR_PATH_DEFAULT}/SESSION-LOG-${todayDateHumanReadable}.md`;

    fs.writeFileSync(
      filePath,
      `# Agent Session on ${todayDateHumanReadable}\n\n`,
    );

    return filePath;
  }

  append(entry: HistoryEntry) {
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

  static create() {
    return new SessionLog();
  }
}
