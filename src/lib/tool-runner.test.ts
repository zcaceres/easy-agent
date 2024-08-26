import { describe, it, expect } from "bun:test";

import ToolRunner from "./tool-runner";
import ToolRegistry from "./tool-registry";
import { ToolUseBlock } from "@anthropic-ai/sdk/src/resources/index.js";

const mockedToolUse: ToolUseBlock = {
  id: "mocked-id",
  input: {},
  name: "mockedTool",
  type: "tool_use",
};

describe("ToolRunner", () => {
  it("should run a tool", async () => {
    const toolUse = mockedToolUse;
    const result = await ToolRunner.use(toolUse, ToolRegistry.mocked());
    expect(result).toEqual("mocked result");
  });

  it("should throw an error if the tool is not registered", async () => {
    const toolUse = mockedToolUse;
    toolUse.name = "my-tool";

    await expect(
      ToolRunner.use(toolUse, ToolRegistry.mocked())
    ).rejects.toThrow(
      "Unknown tool called: my-tool. You need to register it on the agent for it to be used. Available tools: mockedtool"
    );
  });
});
