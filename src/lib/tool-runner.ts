import type { TextBlockParam, ToolUseBlock } from "@anthropic-ai/sdk/resources";
import type ToolRegistry from "src/lib/tool-registry";

export default class ToolRunner {
  static async use(
    toolUse: ToolUseBlock,
    callableTools: ToolRegistry,
  ): Promise<TextBlockParam> {
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

    const result = await tool.callFn(toolUse.input);

    if (typeof result === "string") {
      return {
        type: "text" as const,
        text: result,
      };
    } else {
      return {
        type: "text" as const,
        text: JSON.stringify(result),
      };
    }
  }
}
