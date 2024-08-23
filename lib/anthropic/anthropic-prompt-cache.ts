import type Anthropic from "@anthropic-ai/sdk";
import type { PromptCachingBetaTextBlockParam } from "@anthropic-ai/sdk/src/resources/beta/prompt-caching/messages.js";
import type {
  AgentConfig,
  CacheOption,
  HistoryEntry,
  PromptCache,
} from "definitions";
import globals from "lib/global-config";
import type Tool from "lib/tool";

/**
    The purpose of this module is to cache items in the Anthropic Agent's context based on sensible defaults
    and without exceeding Anthropic's limit of globals.ANTHROPIC_MAX_PROMPT_CACHE_SIZE

    Order matters. We cache the system prompt first, then we cache tools.
 */
class AnthropicPromptCache {
  private cache: PromptCache;
  private capacity: number;

  private constructor(
    capacity: number = globals.ANTHROPIC_MAX_PROMPT_CACHE_SIZE,
  ) {
    this.cache = {
      tools: [],
      system: [],
    };
    this.capacity = capacity;
  }

  private add(
    type: CacheOption,
    item: Tool | PromptCachingBetaTextBlockParam[],
  ): void {
    if (type === "system") {
      this.cache.system = item as PromptCachingBetaTextBlockParam[];
    } else if (type === "tools") {
      if (this.isFull()) {
        return;
      }
      this.cache.tools.push(item as Tool);
    }
  }

  private configureSystemPrompt(baseConfig: AgentConfig) {
    if (baseConfig.cacheOptions.includes("system")) {
      let item = [
        {
          type: "text" as const,
          text: baseConfig.prompt,
          cache_control: { type: "ephemeral" as const },
        },
      ];

      this.add("system", item);
      return item as PromptCachingBetaTextBlockParam[];
    }

    return [
      {
        type: "text" as const,
        text: baseConfig.prompt,
      },
    ] as Anthropic.Messages.TextBlockParam[];
  }

  private configureTools(baseConfig: AgentConfig) {
    if (baseConfig.cacheOptions.includes("tools")) {
      return baseConfig.tools.map((tool) => {
        if (this.isFull()) {
          return {
            ...tool.definition,
          };
        }

        this.add("tools", tool);

        return {
          ...tool.definition,
          cache_control: { type: "ephemeral" as const },
        };
      });
    }

    return baseConfig.tools.map((tool) => tool.definition);
  }

  public configure(baseConfig: AgentConfig, baseMessages: HistoryEntry[]) {
    return {
      system: this.configureSystemPrompt(baseConfig),
      tools: this.configureTools(baseConfig),
      messages: this.configureMessages(baseMessages),
    };
  }

  private configureMessages(baseMessages: HistoryEntry[]) {
    // @TODO: Implement message caching... but will need to think about the right way to do this without exceeding Anthropics hard limit and still offering a good experience.
    return baseMessages;
  }

  private isFull() {
    return this.size >= this.capacity;
  }

  public get size(): number {
    return this.cache.tools.length + this.cache.system.length;
  }

  public static create(capacity?: number): AnthropicPromptCache {
    return new AnthropicPromptCache(capacity);
  }

  public static mocked(): AnthropicPromptCache {
    const mockedCache = new AnthropicPromptCache();
    mockedCache.cache = {
      tools: [],
      system: [],
    };
    mockedCache.capacity = 10; // Arbitrary capacity for testing
    return mockedCache;
  }
}

export default AnthropicPromptCache;
