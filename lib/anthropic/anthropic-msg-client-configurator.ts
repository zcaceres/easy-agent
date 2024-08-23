import type Anthropic from "@anthropic-ai/sdk";
import type { PromptCachingBetaTextBlockParam } from "@anthropic-ai/sdk/src/resources/beta/prompt-caching/index.js";
import type {
  AgentConfig,
  AnthropicClientConfig,
  HistoryEntry,
} from "definitions";

class AnthropicMsgClientConfigurator {
  private static configureSystemPrompt(
    baseConfig: AgentConfig,
  ): PromptCachingBetaTextBlockParam[] {
    return baseConfig.cacheOptions.includes("system")
      ? [
          {
            type: "text" as const,
            text: baseConfig.prompt,
            cache_control: { type: "ephemeral" },
          },
        ]
      : [
          {
            type: "text" as const,
            text: baseConfig.prompt,
          },
        ];
  }

  private static configureTools(baseConfig: AgentConfig) {
    return baseConfig.cacheOptions.includes("tools")
      ? baseConfig.tools.map(({ definition }) => {
          return {
            ...definition,
            cache_control: { type: "ephemeral" as const },
          };
        })
      : baseConfig.tools.map((tool) => tool.definition);
  }

  private static configureMessages(
    baseConfig: AgentConfig,
    baseMessages: HistoryEntry[],
  ) {
    return baseConfig.cacheOptions.includes("conversation")
      ? baseMessages.map((message) => {
          return {
            role: message.role,
            content: message.content.map((block) => {
              return {
                ...block,
                cache_control: { type: "ephemeral" as const },
              };
            }),
          };
        })
      : baseMessages;
  }

  static configure(
    baseClient: Anthropic,
    baseConfig: AgentConfig,
    baseMessages: HistoryEntry[],
  ): AnthropicClientConfig {
    let isPromptCachingEnabled = baseConfig.cacheOptions.length > 0;

    if (isPromptCachingEnabled) {
      let system:
        | Anthropic.Messages.TextBlockParam[]
        | PromptCachingBetaTextBlockParam[] =
        this.configureSystemPrompt(baseConfig);

      let tools = this.configureTools(baseConfig);

      let messages = this.configureMessages(baseConfig, baseMessages);

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

  static mocked(config: AgentConfig): AnthropicClientConfig {
    return AnthropicMsgClientConfigurator.configure(
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
      [],
    );
  }
}

export default AnthropicMsgClientConfigurator;
