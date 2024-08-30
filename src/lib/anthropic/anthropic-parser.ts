import type Anthropic from "@anthropic-ai/sdk";
import { MessageParser } from "src/definitions";

class AnthropicMessageParser implements MessageParser {
  static parse(response: Anthropic.Messages.Message) {
    const text = this.parseTextFromResponse(response);
    const toolUseRequests = this.parseToolUseFromResponse(response);

    return { text, toolUseRequests };
  }

  private static parseTextFromResponse(msg: Anthropic.Messages.Message) {
    const { content } = msg;

    let text = "";

    for (const item of content) {
      if (item.type === "text") {
        text += item.text;
      }
    }

    return text === "" ? "" : text;
  }

  private static parseToolUseFromResponse(msg: Anthropic.Messages.Message) {
    const { content } = msg;

    const toolUses = [];

    for (const item of content) {
      if (item.type === "tool_use") {
        toolUses.push(item);
      }
    }

    return toolUses;
  }
}

export default AnthropicMessageParser;
