import * as fs from "fs";
import type { SessionHistoryEntry } from "definitions";
import config from "lib/config";

export default class SessionHistory {
  filePath;

  constructor() {
    this.filePath = this.createFilePath();
  }

  private createFilePath() {
    let todayDateHumanReadable =
      new Date().toLocaleDateString().replace(/\//g, "-") +
      "--" +
      new Date().toLocaleTimeString();

    const filePath = `${config.SESSION_HISTORY_DIR_PATH_DEFAULT}/SESSION-${todayDateHumanReadable}.md`;

    fs.writeFileSync(
      filePath,
      `# Agent Session on ${todayDateHumanReadable}\n\n`
    );

    return filePath;
  }

  append(entry: SessionHistoryEntry) {
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
    return new SessionHistory();
  }
}
