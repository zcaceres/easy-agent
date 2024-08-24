import { describe, it, expect } from "bun:test";

import Tool from "./tool";

describe("Tool", () => {
  it("should create a tool", () => {
    const tool = Tool.mocked();
    expect(tool.definition).toEqual({
      name: "mockedTool",
      description: "A mocked tool",
      input_schema: {
        type: "object",
        properties: {
          mockedInput: {
            type: "string",
            description: "A mocked input",
          },
        },
        required: ["mockedInput"],
      },
    });
  });

  it("should run a tool", async () => {
    const tool = Tool.mocked();
    const result = await tool.callFn();
    expect(result).toEqual("mocked result");
  });
});
