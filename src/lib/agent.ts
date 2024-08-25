import globals from "src/lib/global-config";
import type {
  AgentConfig,
  AgentInitializer,
  NormalizedName,
} from "definitions";
import NormalizeName from "src/lib/name-normalizer";

import AnthropicClient from "src/lib/anthropic/anthropic-client";
import ToolRegistry from "./tool-registry";
import Tool from "./tool";

class Agent {
  name: NormalizedName;
  config: AgentConfig;
  client: AnthropicClient;
  tools: ToolRegistry;
  start: (input: string) => Promise<void>;

  constructor({
    name,
    prompt,
    tools,
    cacheOptions,
    model,
    mode,
    maxTokens,
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
    this.client = AnthropicClient.create({
      agentConfig: this.config,
      tools: this.tools,
    });
    this.start = this.client.start.bind(this.client);
  }

  getHistory() {
    return this.client.messageHistory.get();
  }

  getLatestMessage() {
    return this.client.messageHistory.latest();
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
