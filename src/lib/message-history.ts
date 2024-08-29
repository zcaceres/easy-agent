import type { HistoryEntry } from "src/definitions";

export abstract class IMessageHistory {
  abstract append(entry: HistoryEntry): void;

  abstract get(): HistoryEntry[];

  abstract clear(): void;

  abstract latest(): HistoryEntry | undefined;

  static from(_entries: HistoryEntry[]): IMessageHistory {
    throw new Error("Method 'from' must be implemented by subclasses");
  }
}

export class AnthropicMessageHistory implements IMessageHistory {
  private history: HistoryEntry[] = [];

  private constructor(startingEntries: HistoryEntry[] = []) {
    this.history = startingEntries;
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
    return new AnthropicMessageHistory(entries);
  }
}
