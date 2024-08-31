import Anthropic from "@anthropic-ai/sdk";

import type { AgentConfig, LLMClient, HistoryEntry } from "src/definitions";
import globals from "src/lib/global-config";
import UI from "src/lib/ui";
import ToolRunner from "src/lib/tool-runner";
import AnthropicMessageParser from "src/lib/anthropic/anthropic-parser";
import ToolRegistry from "src/lib/tool-registry";
import Tool from "src/lib/tool";
import AnthropicMsgClientConfigurator from "src/lib/anthropic/anthropic-msg-client-configurator";
import SessionLog from "src/lib/session-log";
import AnthropicMessageHistory from "src/lib/message-history";
import {
  ToolResultBlockParam,
  ToolUseBlock,
} from "@anthropic-ai/sdk/resources";

class AnthropicClient implements LLMClient {
  private anthropic: Anthropic;
  private baseConfig: AgentConfig;
  private tools: ToolRegistry;
  private messageHistory: AnthropicMessageHistory;
  private sessionHistory: SessionLog;

  private constructor({
    agentConfig,
    tools,
    messageHistory,
    sessionHistory,
  }: {
    agentConfig: AgentConfig;
    tools: ToolRegistry;
    messageHistory: AnthropicMessageHistory;
    sessionHistory: SessionLog;
  }) {
    this.baseConfig = agentConfig;
    const apiKey = globals.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Missing API key. Add it to the global-config.ts file or to your environment variables as ANTHROPIC_API_KEY",
      );
    }

    this.anthropic = new Anthropic({
      apiKey,
    });

    this.tools = tools;
    this.messageHistory = messageHistory;
    this.sessionHistory = sessionHistory;
  }

  private addToMessageHistory(message: HistoryEntry) {
    this.messageHistory.append(message);
    this.sessionHistory.append(message);
  }

  private async processToolUse(
    toolUseBlocks: Anthropic.Messages.ToolUseBlock[],
    tools: ToolRegistry,
  ) {
    const toolUseResults: ToolResultBlockParam[] = [];

    for (const toolUseBlock of toolUseBlocks) {
      let toolResult;
      try {
        toolResult = await ToolRunner.use(toolUseBlock, tools);
        toolUseResults.push({
          type: "tool_result" as const,
          tool_use_id: toolUseBlock.id,
          content: [toolResult],
          is_error: false,
        });
      } catch (e: any) {
        toolUseResults.push({
          type: "tool_result" as const,
          tool_use_id: toolUseBlock.id,
          content: [toolResult ?? e.message],
          is_error: true,
        });
      }
    }

    return toolUseResults;
  }

  private renderAssistant(text: string) {
    UI.render({
      role: "assistant",
      content: [
        {
          type: "text",
          text,
        },
      ],
    });
  }

  getHistory() {
    return this.messageHistory.get();
  }

  getLatestMessage() {
    return this.messageHistory.latest();
  }

  private assembleModelBlock({
    text,
    toolUseRequests,
  }: {
    text: string;
    toolUseRequests: Anthropic.Messages.ToolUseBlock[];
  }) {
    const modelResponseBlock: HistoryEntry = {
      role: "assistant",
      content: [],
    };

    if (text) {
      modelResponseBlock.content.push({
        type: "text",
        text: text,
      });
    }

    if (toolUseRequests.length) {
      modelResponseBlock.content.push(...toolUseRequests);
    }
    return modelResponseBlock;
  }

  private async processResponseLoop(response: Anthropic.Messages.Message) {
    if (response.stop_reason === "max_tokens") {
      UI.red(
        "Max tokens reached, consider increasing the limit or refining your input.",
      );
    }

    const { text, toolUseRequests } = AnthropicMessageParser.parse(response);

    const modelResponseBlock = this.assembleModelBlock({
      text,
      toolUseRequests,
    });

    this.addToMessageHistory(modelResponseBlock);

    const toolUseResults = await this.processToolUse(
      toolUseRequests,
      this.tools,
    );

    if (toolUseResults) {
      this.addToMessageHistory({
        role: "user",
        content: toolUseResults,
      });
    }

    this.renderAssistant(text);
  }

  private async message() {
    const { client, config } = AnthropicMsgClientConfigurator.create(
      this.anthropic,
      this.baseConfig,
      this.messageHistory.get(),
    );

    const msg = await client.create(config);

    await this.processResponseLoop(msg);

    if (msg.stop_reason === "tool_use") {
      // If the model is waiting for tool results, we should send them back immediately. Otherwise we wait for user input.
      await this.message();
    }
  }

  private async stream() {
    const { client, config } = AnthropicMsgClientConfigurator.create(
      this.anthropic,
      this.baseConfig,
      this.messageHistory.get(),
    );

    const stream = client.stream(config);

    const finalMsg = await stream.finalMessage();

    await this.processResponseLoop(finalMsg);

    if (finalMsg.stop_reason === "tool_use") {
      // If the stream terminates with tool_use, Claude is waiting for the tool results before continuing. If we don't restart the stream here, it'll hang and ask for user input before it continues.
      await this.stream();
    }
  }

  async start(userInput?: string) {
    if (!userInput) {
      return;
    }

    this.addToMessageHistory({
      role: "user",
      content: [
        {
          type: "text",
          text: userInput,
        },
      ],
    });

    if (this.baseConfig.mode === "stream") {
      await this.stream();
    } else {
      await this.message();
    }
  }

  static mocked(overrides?: Partial<AgentConfig>) {
    return new AnthropicClient({
      agentConfig: {
        model: "test",
        prompt: "test",
        tools: [Tool.mocked()],
        cacheOptions: [],
        maxTokens: 100,
        mode: "message",
        ...overrides,
      },
      tools: ToolRegistry.mocked(),
      messageHistory: AnthropicMessageHistory.from([]),
      sessionHistory: SessionLog.create(),
    });
  }

  static create({
    agentConfig,
    tools,
    messageHistory,
    sessionHistory,
  }: {
    agentConfig: AgentConfig;
    tools: ToolRegistry;
    messageHistory: AnthropicMessageHistory;
    sessionHistory: SessionLog;
  }) {
    return new AnthropicClient({
      agentConfig,
      tools,
      messageHistory,
      sessionHistory,
    });
  }
}

export default AnthropicClient;
