import { describe, it, expect } from "bun:test";

import AgentSelector from "./agent-selector";
import AgentRegistry from "./agent-registry";
import NormalizeName from "./name-normalizer";
import type Agent from "./agent";

describe("AgentSelector", () => {
  it("should return the selected agent", async () => {
    const registeredAgents = AgentRegistry.mocked();

    const selectedAgent = AgentSelector.fromAgentName(
      "mocked",
      registeredAgents
    ) as Agent;

    expect(selectedAgent.name).toBe(NormalizeName("mocked"));
    expect(selectedAgent.tools.list()).toEqual([NormalizeName("mockedTool")]);
  });
});
