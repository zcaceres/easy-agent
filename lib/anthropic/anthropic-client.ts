import Anthropic from "@anthropic-ai/sdk";

import type { AgentConfig, LLMClient, HistoryEntry } from "definitions";
import globals from "lib/global-config";
import UI from "lib/cli/ui";
import ToolRunner from "lib/tool-runner";
import SessionLog from "lib/session-log";
import Logger from "lib/logger";
import AnthropicParser from "lib/anthropic/anthropic-parser";
import ToolRegistry from "lib/tool-registry";
import MessageHistory from "lib/message-history";
import Tool from "lib/tool";
import AnthropicMsgClientConfigurator from "lib/anthropic/anthropic-msg-client-configurator";

class AnthropicClient implements LLMClient {
  anthropic: Anthropic;
  baseConfig: AgentConfig;
  tools: ToolRegistry;
  messageHistory: MessageHistory;
  sessionHistory: SessionLog;

  private constructor({
    agentConfig,
    tools,
  }: {
    agentConfig: AgentConfig;
    tools: ToolRegistry;
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
    this.messageHistory = MessageHistory.from([]);
    this.sessionHistory = SessionLog.create();
  }

  private addToMessageHistory(message: HistoryEntry) {
    // Anthropic breaks if you send two messages back to back with the same `role`.
    // So if there's a case where the last message is the same role as the current message that we're adding to the history, we'll just append it to the content blocks of the last message instead.

    this.messageHistory.append(message);
    this.sessionHistory.append(message);

    Logger.debug(message);

    if (globals.DEBUG_MODE) Logger.history(this.messageHistory.get());
  }

  private async processToolUse(
    toolUseBlocks: Anthropic.Messages.ToolUseBlock[],
    tools: ToolRegistry,
  ) {
    const toolUseResults = [];

    for (const toolUseBlock of toolUseBlocks) {
      let toolResult;
      try {
        toolResult = await ToolRunner.use(toolUseBlock, tools);
        toolUseResults.push({
          type: "tool_result" as const,
          tool_use_id: toolUseBlock.id,
          content: toolResult,
          is_error: false,
        });
      } catch (e: any) {
        Logger.debug(
          `Running tool "${toolUseBlock.name}" produced error: "${e.message}"`,
        );
        toolUseResults.push({
          type: "tool_result" as const,
          tool_use_id: toolUseBlock.id,
          content: toolResult ?? e.message,
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

  private async processModelResponse(response: Anthropic.Messages.Message) {
    console.dir(response);
    if (response.stop_reason === "max_tokens") {
      UI.red(
        "Max tokens reached, consider increasing the limit or refining your input.",
      );
    }

    if (response.stop_reason === "tool_use") {
      Logger.debug("Tool use detected");
    }

    if (response.stop_reason === "end_turn") {
      Logger.debug("End of conversation turn");
    }

    const { text, toolUseRequests } = AnthropicParser.parse(response);

    const modelResponseBlock = this.assembleModelBlock({
      text,
      toolUseRequests,
    });

    this.addToMessageHistory(modelResponseBlock);
    this.renderAssistant(text);

    const toolUseResults = await this.processToolUse(
      toolUseRequests,
      this.tools,
    );

    if (toolUseResults) {
      this.addToMessageHistory({
        role: "user",
        content: toolUseResults,
      });

      for (const useResult of toolUseResults) {
        Logger.debug(
          `Tool Used: ${useResult.tool_use_id}\nResult: ${useResult.content}`,
        );
      }
    }
  }

  private async message() {
    const { client, config } = AnthropicMsgClientConfigurator.create(
      this.anthropic,
      this.baseConfig,
      this.messageHistory.get(),
    );

    Logger.debug({
      msg: "Created Message Client",
      config,
    });

    const msg = await client.create(config);

    await this.processModelResponse(msg);

    if (msg.stop_reason === "tool_use") {
      // If the model is waiting for tool results, we should send them back immediately.
      // Otherwise we wait for user input.
      Logger.debug("Tool use detected, sending back results.");
      await this.message();
    }
  }

  private async stream() {
    const { client, config } = AnthropicMsgClientConfigurator.create(
      this.anthropic,
      this.baseConfig,
      this.messageHistory.get(),
    );

    Logger.debug({
      msg: "Created Stream Client",
      config,
    });

    const stream = client
      .stream(config)
      .on("error", (error) => UI.red(error.message));

    const finalMsg = await stream.finalMessage();

    await this.processModelResponse(finalMsg);

    // If the stream terminates with tool_use, Claude is waiting for the tool results before continuing. If we don't restart the stream here, it'll hang and ask for user input before it continues.
    if (finalMsg.stop_reason === "tool_use") {
      Logger.debug(
        "Stream ended with tool use, sending results back without user input...",
      );
      await this.stream();
    }
  }

  async start(userInput?: string) {
    if (globals.DEBUG_MODE) {
      Logger.debug("Sending message to Claude...");
    }

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
    });
  }

  static create({
    agentConfig,
    tools,
  }: {
    agentConfig: AgentConfig;
    tools: ToolRegistry;
  }) {
    return new AnthropicClient({ agentConfig, tools });
  }
}

export default AnthropicClient;
