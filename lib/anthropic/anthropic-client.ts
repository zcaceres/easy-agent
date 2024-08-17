import Anthropic from "@anthropic-ai/sdk";

import type { AgentConfig, LLMClient, HistoryEntry } from "definitions";
import config from "lib/config";
import UI from "lib/ui";
import ToolRunner from "lib/tool-runner";
import SessionLog from "lib/session-log";
import Logger from "lib/logger";
import AnthropicParser from "lib/anthropic/anthropic-parser";
import type ToolRegistry from "lib/tool-registry";

class AnthropicClient implements LLMClient {
  client: Anthropic;
  agentConfig: AgentConfig;
  tools: ToolRegistry;
  messageHistory: HistoryEntry[];
  sessionHistory: SessionLog;

  private constructor({
    agentConfig,
    tools,
  }: {
    agentConfig: AgentConfig;
    tools: ToolRegistry;
  }) {
    this.agentConfig = agentConfig;
    const apiKey = config.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Missing API key. Add it to the config.ts file or to your environment variables as ANTHROPIC_API_KEY"
      );
    }

    this.client = new Anthropic({
      apiKey,
    });

    this.tools = tools;
    this.messageHistory = [] as HistoryEntry[];
    this.sessionHistory = SessionLog.create();
  }

  private addToMessageHistory(message: HistoryEntry) {
    const lastEntry = this.messageHistory[this.messageHistory.length - 1];

    // Anthropic breaks if you send two messages back to back with the same `role`.
    // So if there's a case where the last message is the same role as the current message that we're adding to the history, we'll just append it to the content blocks of the last message instead.
    if (lastEntry && lastEntry.role === message.role) {
      lastEntry.content.push(...message.content);
      return;
    } else {
      this.messageHistory.push(message);
    }
    this.sessionHistory.append(message);

    Logger.debug(message);

    if (config.DEBUG_MODE) Logger.history(this.messageHistory);
  }

  private async processToolUse(
    toolUseBlocks: Anthropic.Messages.ToolUseBlock[],
    tools: ToolRegistry
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
          `Running tool "${toolUseBlock.name}" produced error: "${e.message}"`
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
    if (response.stop_reason === "max_tokens") {
      UI.red(
        "Max tokens reached, consider increasing the limit or refining your input."
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
      this.tools
    );

    if (toolUseResults) {
      this.addToMessageHistory({
        role: "user",
        content: toolUseResults,
      });

      for (const useResult of toolUseResults) {
        Logger.debug(
          `Tool Used: ${useResult.tool_use_id}\nResult: ${useResult.content}`
        );
      }
    }
  }

  private async message() {
    const msg = await this.client.messages.create({
      messages: this.messageHistory,
      model: this.agentConfig.model,
      system: this.agentConfig.prompt,
      max_tokens: this.agentConfig.maxTokens,
      tools: this.agentConfig.tools.map((tool) => tool.definition),
    });
    await this.processModelResponse(msg);

    if (msg.stop_reason === "tool_use") {
      // If the model is waiting for tool results, we should send them back immediately.
      // Otherwise we wait for user input.
      Logger.debug("Tool use detected, sending back results.");
      await this.message();
    }
  }

  private async stream() {
    const stream = this.client.messages
      .stream({
        messages: this.messageHistory,
        model: this.agentConfig.model,
        system: this.agentConfig.prompt,
        max_tokens: this.agentConfig.maxTokens,
        tools: this.agentConfig.tools.map((tool) => tool.definition),
      })
      .on("error", (error) => UI.red(error.message));

    const finalMsg = await stream.finalMessage();

    await this.processModelResponse(finalMsg);

    // If the stream terminates with tool_use, Claude is waiting for the tool results before continuing. If we don't restart the stream here, it'll hang and ask for user input before it continues.
    if (finalMsg.stop_reason === "tool_use") {
      Logger.debug(
        "Stream ended with tool use, sending results back without user input..."
      );
      await this.stream();
    }
  }

  getHistory() {
    return this.messageHistory;
  }

  async start(userInput?: string) {
    if (config.DEBUG_MODE) {
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

    if (this.agentConfig.mode === "stream") {
      await this.stream();
    } else {
      await this.message();
    }
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
