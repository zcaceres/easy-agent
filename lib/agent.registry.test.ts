import { describe, it, expect } from "bun:test";

import AgentRegistry from "./agent-registry";
import Tool from "./tool";
import NormalizeName from "./name-normalizer";
import Agent from "./agent";

describe("AgentRegistry", () => {
  it("should create a new instance of AgentRegistry", () => {
    const registry = AgentRegistry.mocked();

    expect(registry).toBeInstanceOf(AgentRegistry);
  });

  it("should return a list of agent names", () => {
    const registry = AgentRegistry.mocked();

    expect(registry.list()).toEqual([Agent.mocked().name]);
  });

  it("should return true when the agent exists", () => {
    const registry = AgentRegistry.mocked();

    expect(registry.exists("mocked")).toBe(true);
  });

  it("should return false when the agent does not exist", () => {
    const registry = AgentRegistry.mocked();

    expect(registry.exists("missing")).toBe(false);
  });

  it("should return the agent", () => {
    const registry = AgentRegistry.mocked();

    expect(registry.get("mocked")!.name).toEqual(Agent.mocked().name);
    expect(registry.get("mocked")!.tools.list()).toEqual([
      NormalizeName(Tool.mocked().definition.name),
    ]);
  });
});
