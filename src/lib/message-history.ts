import type { HistoryEntry, IMessageHistory } from "../definitions";
import fs from "fs";
import globals from "./global-config";

export default class AnthropicMessageHistory implements IMessageHistory {
  private history: HistoryEntry[] = [];
  private historyLogFilePath: string;

  private constructor(
    startingEntries: HistoryEntry[] = [],
    historyLogFilePath = globals.MESSAGE_HISTORY_LOG_FILE_PATH_DEFAULT,
  ) {
    this.history = startingEntries;
    this.historyLogFilePath = historyLogFilePath;
  }

  append(entry: HistoryEntry) {
    // Anthropic breaks if you send two messages back to back with the same `role`.
    // So if there's a case where the last message is the same role as the current message that we're adding to the history, we'll just append it to the content blocks of the last message instead.
    const latestEntry = this.latest();
    if (latestEntry && latestEntry.role === entry.role) {
      latestEntry.content.push(...entry.content);
      // We made a copy of latestEntry so we need to re-assign it to the in-memory history to update the state
      this.history[this.history.length - 1] = latestEntry;
      return;
    }
    this.history.push(entry);
    this.log();
  }

  get() {
    return structuredClone(this.history);
  }

  clear() {
    this.history = [];
  }

  latest() {
    return structuredClone(this.history[this.history.length - 1]);
  }

  log() {
    if (globals.LOG_MODE === "debug") {
      fs.writeFileSync(
        this.historyLogFilePath,
        JSON.stringify(this.get(), null, 2),
      );
    }
  }

  static from(entries: HistoryEntry[], historyLogFilePath?: string) {
    return new AnthropicMessageHistory(entries, historyLogFilePath);
  }
}
