import type {
  TextBlockParam,
  ToolResultBlockParam,
  ToolUseBlockParam,
  Model,
} from "@anthropic-ai/sdk/resources";
import Anthropic from "@anthropic-ai/sdk";
import Tool from "src/lib/tool";
import { PromptCachingBetaTextBlockParam } from "@anthropic-ai/sdk/resources/beta/prompt-caching/messages";
import Agent from "./lib/agent";

export abstract class Registry {
  abstract list(): NormalizedName[];
  abstract exists(name: string): boolean;
  abstract get(name: string): Agent | Tool | null;

  static create(_itemsToRegister: Agent[] | Tool[]): Registry {
    // Implementation of the static method
    // This method should return an instance of a concrete class that extends Registry
    throw new Error("Method not implemented.");
  }
}

export type SourceType = "user" | "assistant";

export type HistoryEntry = {
  role: SourceType;
  content: Array<
    | TextBlockParam
    | ToolUseBlockParam
    | ToolResultBlockParam
    | PromptCachingBetaTextBlockParam
  >;
};

export type LogMode = "debug" | "test" | "none";

export type CLIArgs = {
  model?: string;
  maxModelTokens?: number;
  debug?: boolean;
  testMode?: boolean;
  apiKey?: string;
  voice?: boolean;
};

export type CLIOptions = {
  voice: boolean;
};

export type Globals = {
  LOG_MODE: LogMode;
  MAX_MODEL_TOKENS_DEFAULT: number;
  ANTHROPIC_MODEL_DEFAULT: Model;
  MESSAGE_HISTORY_LOG_FILE_PATH_DEFAULT: string;
  SESSION_HISTORY_LOG_DIR_PATH_DEFAULT: string;
  ANTHROPIC_API_KEY: string | undefined;
  ANTHROPIC_MAX_PROMPT_CACHE_SIZE: number;
  VOICE_MODE: boolean;
};

export type CacheOption = "tools" | "system";

export type AgentConfig = {
  prompt: string;
  tools: Tool[];
  cacheOptions: CacheOption[];
  model: Model;
  mode: TransmissionMode;
  maxTokens: number;
};

export type AnthropicConfiguredClient = {
  client: Anthropic.Beta.PromptCaching.Messages | Anthropic.Messages;
  config: AnthropicClientConfig;
};

export type AnthropicClientConfig = {
  messages: HistoryEntry[];
  model: Model;
  system: string | TextBlockParam[] | PromptCachingBetaTextBlockParam[];
  max_tokens: number;
  tools: ToolDefinition[];
};

export type AgentInitializer = Partial<AgentConfig> & {
  name: string;
  provider?: "anthropic"; // Add more providers in the future.
};

export type TransmissionMode = "message" | "stream";

export type ToolDefinition = {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
    required: string[];
  };
} & {
  cache_control?: {
    type: "ephemeral";
  };
};

export type ToolConfig = {
  name: string;
  description: string;
  inputs: ToolArg[];
  fn: (...args: any[]) => Promise<any>;
};

export type ToolArg = {
  name: string;
  type: "string" | "number" | "array" | "object";
  description: string;
  required?: boolean;
};

export type ToolMap = Map<NormalizedName, Tool>;
export type AgentMap = Map<NormalizedName, Agent>;

export abstract class LLMClient {
  abstract start: (input: string) => Promise<void>;

  static create(_agentInit: AgentInitializer): Agent {
    throw new Error("Must implement create()");
  }
}

export abstract class IMessageHistory {
  abstract append(entry: HistoryEntry): void;

  abstract get(): HistoryEntry[];

  abstract clear(): void;

  abstract latest(): HistoryEntry | undefined;

  abstract log(): void;

  static from(
    _entries: HistoryEntry[],
    _historyLogFilePath?: string,
  ): IMessageHistory {
    throw new Error("Method 'from' must be implemented by subclasses");
  }
}

export abstract class MessageParser {
  static parse(_response: Anthropic.Messages.Message) {
    throw new Error("Must implement method");
  }
}

type Distinct<T, DistinctName> = T & { __TYPE__: DistinctName };

export type NormalizedName = Distinct<string, "NormalizedName">;

export namespace ServerAgent {
  export type Request = {
    agentName: string;
    message: string;
    stateful?: boolean;
  };

  export type Response = {
    messages: HistoryEntry[];
  };

  export interface NotFoundError {
    message: string;
  }
}

export type PromptCache = {
  tools: Tool[];
  system: PromptCachingBetaTextBlockParam[];
};

export type AnthropicModelTypes = Anthropic.Messages.Model;
