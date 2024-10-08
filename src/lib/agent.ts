import globals from "src/lib/global-config";
import type {
  AgentConfig,
  AgentInitializer,
  NormalizedName,
} from "src/definitions";
import NormalizeName from "src/lib/name-normalizer";
import SessionLog from "src/lib/session-log";
import AnthropicMessageHistory from "src/lib/message-history";

import AnthropicClient from "src/lib/anthropic/anthropic-client";
import ToolRegistry from "./tool-registry";
import Tool from "./tool";

class Agent {
  name: NormalizedName;
  config: AgentConfig;
  client: AnthropicClient;
  tools: ToolRegistry;
  start: (input: string) => Promise<void>;

  private constructor({
    name,
    prompt,
    tools,
    cacheOptions,
    model,
    mode,
    maxTokens,
    provider = "anthropic",
  }: AgentInitializer) {
    this.name = NormalizeName(name);
    this.config = {
      prompt: prompt || "",
      tools: tools || [],
      cacheOptions: cacheOptions || [],
      model: model || globals.ANTHROPIC_MODEL_DEFAULT,
      mode: mode || "message",
      maxTokens: maxTokens || globals.MAX_MODEL_TOKENS_DEFAULT,
    };
    this.tools = ToolRegistry.create(this.config.tools);
    // In the future, we'd instantiate a client based on the type of model that's been chosen in the configuration above.
    switch (provider) {
      case "anthropic":
        this.client = AnthropicClient.create({
          agentConfig: this.config,
          tools: this.tools,
          messageHistory: AnthropicMessageHistory.from([]),
          sessionHistory: SessionLog.create(),
        });
        this.start = this.client.start.bind(this.client);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  getHistory() {
    return this.client.getHistory();
  }

  getLatestMessage() {
    return this.client.getLatestMessage();
  }

  static create({
    name,
    prompt,
    tools,
    cacheOptions,
    model,
    mode,
    maxTokens,
  }: AgentInitializer) {
    return new Agent({
      name,
      prompt,
      tools,
      cacheOptions,
      model,
      mode,
      maxTokens,
    });
  }

  static mocked() {
    return new Agent({
      name: "mocked",
      prompt: "mocked",
      tools: [Tool.mocked()],
      cacheOptions: [],
      model: "mocked",
      maxTokens: 1,
    });
  }
}

export default Agent;
