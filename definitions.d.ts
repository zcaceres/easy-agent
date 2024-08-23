import type {
  TextBlockParam,
  ToolResultBlockParam,
  ToolUseBlockParam,
} from "@anthropic-ai/sdk/resources/index.mjs";
import Tool from "lib/tool";
import type { Model } from "@anthropic-ai/sdk/src/resources/messages.js";
import type { PromptCachingBetaTextBlockParam } from "@anthropic-ai/sdk/src/resources/beta/prompt-caching/messages.js";

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

export type CLIArgs = {
  model?: string;
  maxModelTokens?: number;
  debugMode?: boolean;
  apiKey?: string;
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
  client:
    | Anthropic.Beta.PromptCaching.PromptCachingBetaMessage
    | Anthropic.Messages.Message;
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
  fn: (...args: any[]) => any;
};

export type ToolArg = {
  name: string;
  type: "string" | "number" | "array" | "object";
  description: string;
  required?: boolean;
};

export type ToolMap = Map<NormalizedName, Tool>;
export type AgentMap = Map<NormalizedName, Agent>;

export interface LLMClient {
  start: (input: string) => Promise<void>;
}

declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
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

export abstract class Registry {
  abstract list(): NormalizedName[];
  abstract exists(itemName: string): boolean;
  abstract get(itemName: string): Agent | null;

  static create(itemsToRegister: Agent[] | Tool[]): Registry {}
}

export type PromptCache = {
  tools: Tool[];
  system: PromptCachingBetaTextBlockParam[];
};
