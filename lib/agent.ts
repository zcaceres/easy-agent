import config from "lib/config";
import type { AgentConfig, AgentInitializer, ToolMap } from "definitions";

import AnthropicClient from "lib/anthropic/anthropic-client";
import Logger from "lib/logger";

class Agent {
  name: string;
  config: AgentConfig;
  client: AnthropicClient;
  tools: ToolMap;
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
    this.name = name;
    this.config = {
      prompt: prompt || "",
      tools: tools || [],
      cacheOptions: cacheOptions || [],
      model: model || config.ANTHROPIC_MODEL_DEFAULT,
      mode: mode || "message",
      maxTokens: maxTokens || config.MAX_MODEL_TOKENS_DEFAULT,
    };
    this.tools = {};
    if (tools && tools.length > 0) {
      // It makes it easier to call the tools downstream to have them in a map...
      tools.forEach((tool) => {
        Logger.debug(`Tool: ${tool.definition}`);
        this.tools[tool.definition.name] = tool;
      });
    }
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
