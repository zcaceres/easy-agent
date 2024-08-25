import type Anthropic from "@anthropic-ai/sdk";
import type {
  AgentConfig,
  AnthropicConfiguredClient,
  HistoryEntry,
} from "src/definitions";
import AnthropicPromptCache from "./anthropic-prompt-cache";

class AnthropicMsgClientConfigurator {
  static create(
    baseClient: Anthropic,
    baseConfig: AgentConfig,
    baseMessages: HistoryEntry[]
  ): AnthropicConfiguredClient {
    let isPromptCachingEnabled = baseConfig.cacheOptions.length > 0;

    if (!isPromptCachingEnabled) {
      return {
        client: baseClient.messages,
        config: {
          messages: baseMessages,
          model: baseConfig.model,
          system: baseConfig.prompt,
          max_tokens: baseConfig.maxTokens,
          tools: baseConfig.tools.map((tool) => tool.definition),
        },
      };
    }

    const promptCache = AnthropicPromptCache.create();
    const { system, tools, messages } = promptCache.configure(
      baseConfig,
      baseMessages
    );

    return {
      client: baseClient.beta.promptCaching.messages,
      config: {
        messages,
        model: baseConfig.model,
        system,
        max_tokens: baseConfig.maxTokens,
        tools,
      },
    };
  }

  static mocked(config: AgentConfig): AnthropicConfiguredClient {
    return AnthropicMsgClientConfigurator.create(
      {
        messages: {
          // @ts-ignore
          create: () => {},
          // @ts-ignore
          stream: () => {},
        },
        beta: {
          promptCaching: {
            messages: {
              // @ts-ignore
              create: () => {},
              // @ts-ignore
              stream: () => {},
            },
          },
        },
      },
      config,
      []
    );
  }
}

export default AnthropicMsgClientConfigurator;
