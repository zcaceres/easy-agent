import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import SessionLog from "./session-log";
import * as fs from "fs";

mock.module("fs", () => ({
  writeFileSync: mock(() => {}),
  appendFileSync: mock(() => {}),
}));

mock.module("src/lib/global-config", () => ({
  default: {
    SESSION_LOG_DIR_PATH_DEFAULT: "/mock/path",
  },
}));

describe("SessionLog", () => {
  let sessionLog: SessionLog;
  const mockDate = new Date("2023-04-01T12:00:00");

  beforeEach(() => {
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as DateConstructor;
    sessionLog = SessionLog.create();
  });

  afterEach(() => {
    // Reset mocks
    mock.restore();
  });

  it("creates file path with correct format", () => {
    expect(sessionLog.filePath).toBe(
      "/mock/path/SESSION-LOG-4-1-2023--12:00:00 PM.md",
    );
  });

  it("writes initial content to file", () => {
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      "# Agent Session on 4-1-2023--12:00:00 PM\n\n",
    );
  });

  it("appends user entry correctly", () => {
    const userEntry = {
      role: "user",
      content: [
        { type: "text", text: "Hello" },
        { type: "tool_result", tool_use_id: "calculator", content: "2+2=4" },
      ],
    };

    sessionLog.append(userEntry);

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.any(String),
      "*User:*\nHello\n\n**Tool Used: calculator**\n\n**Result: 2+2=4**\n\n",
    );
  });

  it("appends Claude entry correctly", () => {
    const claudeEntry = {
      role: "assistant",
      content: [
        { type: "text", text: "Hi there!" },
        { type: "tool_use", name: "web_search", input: { query: "weather" } },
      ],
    };

    sessionLog.append(claudeEntry);

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.any(String),
      '*Claude:*\nHi there!\n\n**Claude asked for tool web_search with input {"query":"weather"}**\n\n',
    );
  });

  it("static create method returns new instance", () => {
    const newSessionLog = SessionLog.create();
    expect(newSessionLog).toBeInstanceOf(SessionLog);
  });
});
