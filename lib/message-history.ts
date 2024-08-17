import type { HistoryEntry } from "definitions";

export default class MessageHistory {
  private history: HistoryEntry[] = [];

  private constructor(startingEntries: HistoryEntry[] = []) {
    this.history = startingEntries;
  }

  append(entry: HistoryEntry) {
    const latestEntry = this.latest();
    if (latestEntry && latestEntry.role === entry.role) {
      latestEntry.content.push(...entry.content);
      // We made a copy of latestEntry so we need to re-assign it to the in-memory history to update the state
      this.history[this.history.length - 1] = latestEntry;
      return;
    }
    this.history.push(entry);
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

  static from(entries: HistoryEntry[]) {
    return new MessageHistory(entries);
  }
}
