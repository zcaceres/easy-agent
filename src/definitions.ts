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

export type LogLevel = "verbose" | "laconic";

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
