import { describe, it, expect } from "bun:test";

import MessageHistory from "./message-history";
import type { SourceType } from "src/definitions";

describe("MessageHistory", () => {
  it("should create a new instance of MessageHistory", () => {
    const history = MessageHistory.from([]);

    expect(history).toBeInstanceOf(MessageHistory);
  });

  it("should append a new entry to the history", () => {
    const history = MessageHistory.from([]);
    const entry = {
      role: "user" as SourceType,
      content: [
        {
          type: "text" as const,
          text: "Hello, world!",
        },
      ],
    };

    history.append(entry);

    expect(history.latest()).toEqual(entry);
  });

  it("should append a new entry to the history with the same role", () => {
    const history = MessageHistory.from([]);
    const entry = {
      role: "assistant" as SourceType,
      content: [
        {
          type: "text" as const,
          text: "Hello, world!",
        },
      ],
    };

    history.append(entry);
    history.append(entry);

    expect(history.latest()).toEqual({
      role: "assistant",
      content: [
        {
          type: "text" as const,
          text: "Hello, world!",
        },
        {
          type: "text" as const,
          text: "Hello, world!",
        },
      ],
    });
  });

  it("should clear the history", () => {
    const history = MessageHistory.from([]);
    const entry = {
      role: "user" as SourceType,
      content: [
        {
          type: "text" as const,
          text: "Hello, world!",
        },
      ],
    };

    history.append(entry);
    history.clear();

    expect(history.latest()).toBeUndefined();
  });
});
