import type { ToolUseBlock } from "@anthropic-ai/sdk/resources";
import type ToolRegistry from "src/lib/tool-registry";

export default class ToolRunner {
  static async use(toolUse: ToolUseBlock, callableTools: ToolRegistry) {
    const tool = callableTools.get(toolUse.name);
    if (!tool) {
      throw new Error(
        `Unknown tool called: ${
          toolUse.name
        }. You need to register it on the agent for it to be used. Available tools: ${callableTools
          .list()
          .join(", ")}`,
      );
    }
    return tool.callFn(toolUse.input);
  }
}
