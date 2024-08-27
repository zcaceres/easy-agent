import { describe, it, expect } from "bun:test";

import Agent from "./agent";
import NormalizeName from "./name-normalizer";
import Tool from "./tool";

describe("Agent", () => {
  it("should create an agent", () => {
    const agent = Agent.create({
      name: "mocked",
      prompt: "mocked",
      tools: [Tool.mocked()],
      cacheOptions: [],
      model: "mocked",
      mode: "message",
      maxTokens: 2048,
    });
    expect(agent.name).toEqual(NormalizeName("mocked"));
    expect(agent.config.prompt).toEqual("mocked");
    expect(agent.config.tools[0].definition).toEqual(Tool.mocked().definition);
    expect(agent.config.cacheOptions).toEqual([]);
    expect(agent.config.model).toEqual("mocked");
    expect(agent.config.mode).toEqual("message");
    expect(agent.config.maxTokens).toEqual(2048);
  });

  it("should get the history", () => {
    const agent = Agent.mocked();
    const history = agent.getHistory();
    expect(history).toEqual([]);
  });

  it("should get the latest message", () => {
    const agent = Agent.mocked();
    const message = agent.getLatestMessage();
    expect(message).toBeFalsy();
  });
});
