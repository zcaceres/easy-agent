import type { ToolUseBlock } from "@anthropic-ai/sdk/resources/index.mjs";
import type { ToolMap } from "definitions";

export default class ToolRunner {
  static async use(toolUse: ToolUseBlock, callableTools: ToolMap) {
    const tool = callableTools[toolUse.name];
    if (!tool) {
      throw new Error(
        `Unknown tool called: ${
          toolUse.name
        }. You need to register it on the agent for it to be used. Available tools: ${Object.keys(
          callableTools
        ).join(", ")}`
      );
    }
    return tool.callFn(toolUse.input);
  }
}
