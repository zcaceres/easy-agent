import config from "lib/config";
import type {
  AgentConfig,
  AgentInitializer,
  NormalizedName,
} from "definitions";
import NormalizeName from "lib/name-normalizer";

import AnthropicClient from "lib/anthropic/anthropic-client";
import ToolRegistry from "./tool-registry";

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
      model: model || config.ANTHROPIC_MODEL_DEFAULT,
      mode: mode || "message",
      maxTokens: maxTokens || config.MAX_MODEL_TOKENS_DEFAULT,
    };
    this.tools = ToolRegistry.create(this.config.tools);
    this.client = AnthropicClient.create({
      agentConfig: this.config,
      tools: this.tools,
    });
    this.start = this.client.start.bind(this.client);
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
}

export default Agent;
