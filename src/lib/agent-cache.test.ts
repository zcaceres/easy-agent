import { describe, it, expect } from "bun:test";

import AgentCache from "./agent-cache";
import Agent from "./agent";

describe("AgentCache", () => {
  it("should set and get values correctly", () => {
    const cache = AgentCache.create();

    const agent = Agent.mocked();
    cache.set("123", agent);

    expect(cache.get("123")).toEqual(agent);
    expect(cache.get("456")).toBeNull();
  });

  it("should create a new instance of AgentCache", () => {
    const cache = AgentCache.create();

    expect(cache).toBeInstanceOf(AgentCache);
  });

  it("should return null when key is not found", () => {
    const cache = AgentCache.create();

    expect(cache.get("123")).toBeNull();
  });
});
