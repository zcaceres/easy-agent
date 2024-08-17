import type {
  TextBlockParam,
  ToolResultBlockParam,
  ToolUseBlockParam,
} from "@anthropic-ai/sdk/resources/index.mjs";
import Tool from "lib/tool";
import type { Model } from "@anthropic-ai/sdk/src/resources/messages.js";

export type SourceType = "user" | "assistant";

export type SessionHistoryEntry = {
  role: SourceType;
  content: Array<TextBlockParam | ToolUseBlockParam | ToolResultBlockParam>;
};

export type CLIArgs = {
  model?: string;
  maxModelTokens?: number;
  debugMode?: boolean;
  apiKey?: string;
};

export type CacheOption = "tools" | "system" | "conversation";

export type AgentConfig = {
  prompt: string;
  tools: Tool[];
  cacheOptions: CacheOption[];
  model: Model;
  mode: TransmissionMode;
  maxTokens: number;
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

export type ToolMap = Record<string, Tool>;

export interface LLMClient {
  start: (input: string) => Promise<void>;
}
